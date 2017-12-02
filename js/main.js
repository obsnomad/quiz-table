function array_unique(arr, key) {
    var tmp_arr = [];
    var tmp_arr_key = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmp_arr_key.indexOf(key ? arr[i][key] : arr[i]) == "-1") {
            tmp_arr.push(arr[i]);
            tmp_arr_key.push(arr[i][key]);
        }
    }
    return tmp_arr;
}

function fillListFromStorage() {
    var ul = $('#teams-list').html('');
    var data = localStorage.getItem('teams-list');
    data = data ? JSON.parse(data) : [];
    if (data.length > 0) {
        data.forEach(function (item) {
            var text = item.trim();
            var li = $('<li>', {
                title: 'Добавить/убрать'
            }).data('text', text);
            var edit = $('<a>', {
                class: 'team-btn team-edit'
            }).click(function () {
                var parent = $(this).parents('li').first();
                var text = parent.data('text');
                var input = $('<input>', {
                    type: 'text'
                }).val(text).on('keyup blur', function (e) {
                    var key = e && e.keyCode ? e.keyCode : -1;
                    if (key === -1 || key === 13 || key === 27) {
                        if ($(this).val().trim().length !== 0 && key !== 27) {
                            text = $(this).val().trim();
                        }
                        updateTableName(parent.data('text'), text);
                        parent.data('text', text);
                        $('span', parent).html(text);
                        $(this).remove();
                        updateList();
                    }
                });
                $('span', parent).html(input);
                input.focus();
            });
            var add = $('<a>', {
                class: 'team-btn team-add'
            }).click(function () {
                var parent = $(this).parents('li').first();
                var text = parent.data('text');
                var table = $('#table-list');
                if ($('tr[data-text="' + text.replace(/"/g, '\\"') + '"]').length === 0) {
                    addTableToStorage([{
                        name: text
                    }]);
                    fillTableFromStorage();
                }
                else {
                    bootbox.confirm('Вы действительно хотите убрать команду из таблицы результатов?', function (e) {
                        if (e) {
                            removeTableItemFromStorage(text);
                            fillTableFromStorage();
                        }
                    });
                }
            });
            var del = $('<a>', {
                class: 'team-btn team-delete'
            }).click(function () {
                var parent = $(this).parents('li').first();
                bootbox.confirm('Вы действительно хотите удалить команду?', function (e) {
                    if (e) {
                        parent.remove();
                        updateList();
                        removeTableItemFromStorage(text);
                        fillTableFromStorage();
                    }
                });
            });
            li.append($('<span>').text(text)).append(edit).append(add).append(del);
            ul.append(li);
        });
    }
}

function updateTableName(oldName, newName) {
    var data = getTable();
    data.forEach(function (value, i) {
        if (value.name === oldName) {
            data[i].name = newName;
            saveTableToStorage(data);
            fillTableFromStorage();
            return false;
        }
    });
}

function removeTableItemFromStorage(name) {
    var data = getTable();
    data.forEach(function (value, i) {
        if (value.name === name) {
            data.splice(i, 1);
            saveTableToStorage(data);
            fillTableFromStorage();
            return false;
        }
    });
}

function updateList() {
    var data = [];
    $('li', '#teams-list').each(function () {
        data.push($(this).data('text'));
    });
    saveListToStorage(data);
}

function addListToStorage(data) {
    var data_old = localStorage.getItem('teams-list');
    data_old = data_old ? JSON.parse(data_old) : [];
    localStorage.setItem('teams-list', JSON.stringify(array_unique((data.concat(data_old)).sort())));
}

function saveListToStorage(data) {
    localStorage.setItem('teams-list', JSON.stringify(array_unique(data.sort())));
}

function addListItem() {
    var input = $('#btn-team-add-text');
    var text = input.val().trim();
    if (text.length > 0) {
        addListToStorage([text]);
        input.val('');
        fillListFromStorage();
    }
}

function calcSum(parent) {
    var sum = 0;
    $('input', parent).each(function () {
        var val = parseFloat($(this).val().replace(',', '.'));
        if (!isNaN(val)) {
            sum += val;
        }
    });
    $('.table-item-sum', parent).text(sum);
}

function addCellWithInput(tr, data, i, j, item) {
    $('<td>').appendTo(tr).append($('<input>', {
        type: 'text',
        class: 'form-control'
    }).keyup(function () {
        calcSum($(this).parents('tr'));
        if (!data[i].rounds) {
            data[i].rounds = [];
        }
        var val = parseFloat($(this).val().replace(',', '.'));
        val = isNaN(val) ? '' : val;
        data[i].rounds[j] = val;
        saveTableToStorage(data);
        var canvas = document.getElementById('canvas');
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        $(canvas).hide();
    }).val(item.rounds && item.rounds[j] ? item.rounds[j] : ''));
}

function fillTableFromStorage() {
    var table = $('#table-list').html('');
    var tr = $('<tr>').appendTo(table);
    $('<th>').appendTo(tr).text('Команда');
    var rule = getRule();
    rule.rounds.forEach(function (round) {
        if (typeof round === 'object') {
            round.subrounds.forEach(function (subround) {
                $('<th>').appendTo(tr).text(subround);
            })
        }
        else {
            $('<th>').appendTo(tr).text(round);
        }
    });
    $('<th>').appendTo(tr).text('Сумма');
    var data = getTable();
    if (data.length > 0) {
        data.forEach(function (item, i) {
            var tr = $('<tr>', {
                'data-text': item.name
            }).appendTo(table).data('text', item.name);
            $('<td>').appendTo(tr).text(item.name);
            var j = 0;
            rule.rounds.forEach(function (round) {
                if (typeof round === 'object') {
                    round.subrounds.forEach(function () {
                        addCellWithInput(tr, data, i, j++, item);
                    });
                }
                else {
                    addCellWithInput(tr, data, i, j++, item);
                }
            });
            $('<td>', {
                class: 'table-item-sum'
            }).appendTo(tr);
            calcSum(tr);
        });
    }
    var canvas = document.getElementById('canvas');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    $(canvas).hide();
}

function compareTableItems(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function getTable() {
    var data = localStorage.getItem('table-list');
    return data ? JSON.parse(data) : [];
}

function addTableToStorage(data) {
    var data_old = localStorage.getItem('table-list');
    data_old = data_old ? JSON.parse(data_old) : [];
    localStorage.setItem('table-list', JSON.stringify(array_unique((data.concat(data_old)).sort(compareTableItems), 'name')));
}

function saveTableToStorage(data) {
    localStorage.setItem('table-list', JSON.stringify(array_unique(data.sort(compareTableItems), 'name')));
}

function changeRule() {
    var select = $('#games-list');
    var current = $('option[value=' + select.val() + ']', select);
    localStorage.setItem('rule', JSON.stringify(current.data('rule')));
    fillTableFromStorage();
}

function getRule() {
    var data = localStorage.getItem('rule');
    data = data ? JSON.parse(data) : {};
    if (data && data.rounds) {
        data.roundsCount = 0;
        data.rounds.forEach(function (round) {
            if (typeof round === 'object') {
                round.subrounds.forEach(function () {
                    data.roundsCount++;
                });
                data.roundsCount++;
            }
            else {
                data.roundsCount++;
            }
        });
    }
    return data;
}

var maxRoundValues = [];
function getExportData(isFinal) {
    var data = getTable();
    var dataExport = [];
    if (data.length > 0) {
        var rule = getRule();
        var curRound = 0;
        var curRoundSum = 0;
        maxRoundValues = [];
        // Определить текущий раунд (отсчёт от 1) и максимальный балл в каждом раунде, если требуется
        data.forEach(function (item) {
            if (item.rounds) {
                item.rounds.forEach(function (round, j) {
                    if (!isNaN(parseFloat(round))) {
                        curRound = Math.max(curRound, j + 1);
                        if(rule.roundsPriority) {
                            if(!maxRoundValues[j]) {
                                maxRoundValues[j] = 0;
                            }
                            maxRoundValues[j] = Math.max(maxRoundValues[j], round);
                        }
                    }
                });
            }
        });
        // Просчитать итог по текущему раунду и заполнить пропущенные значения нолями
        var nonZero = {};
        data.forEach(function (item, i) {
            var sum = 0;
            var checksum = '';
            var checksumRounds = 0;
            if (!data[i].rounds) {
                data[i].rounds = [];
            }
            var j = 0;
            rule.rounds.forEach(function (round, k) {
                var show = !isFinal || (isFinal && (rule.rounds.length - k <= (rule.finalRounds ? rule.finalRounds : 1)));
                if (j < curRound) {
                    curRoundSum = Math.max(curRoundSum, k);
                    if (typeof round === 'object') {
                        var roundsSum = 0;
                        round.subrounds.forEach(function () {
                            var val = show && item.rounds && item.rounds[j] ? parseFloat(item.rounds[j]) : 0;
                            val = isNaN(val) ? 0 : val;
                            data[i].rounds[j] = show ? val : '';
                            if(val > 0) {
                                nonZero[j] = true;
                            }
                            roundsSum += val;
                            j++;
                        });
                        sum += roundsSum;
                        if (!data[i].roundsSum) {
                            data[i].roundsSum = [];
                        }
                        data[i].roundsSum[j] = roundsSum;
                        if(rule.pointsPriority) {
                            checksum += roundsSum;
                        }
                    }
                    else {
                        var val = show && item.rounds && item.rounds[j] ? parseFloat(item.rounds[j]) : 0;
                        val = isNaN(val) ? 0 : val;
                        sum += val;
                        if (!data[i].roundsSum) {
                            data[i].roundsSum = [];
                        }
                        if(val > 0) {
                            nonZero[j] = true;
                        }
                        data[i].rounds[j] = show ? val : '';
                        data[i].roundsSum[j] = val;
                        if(rule.pointsPriority) {
                            checksum = ('000' + val * 10).slice(-3) + checksum;
                        }
                        if(rule.roundsPriority && val === maxRoundValues[j]) {
                            checksumRounds++;
                        }
                        j++;
                    }
                }
                else {
                    return false;
                }
            });
            data[i].sum = sum;
            data[i].checksum = rule.roundsPriority ? sum * 10 + ('000' + checksumRounds).slice(-3) + checksum : checksum + sum;
            data[i].rounds.splice(curRound);
        });
        // Отсортировать по очкам
        data.sort(function (a, b) {
            if (a.sum < b.sum) {
                return 1;
            }
            if (a.sum > b.sum) {
                return -1;
            }
            if(rule.roundsPriority) {
                if (a.checksum < b.checksum) {
                    return 1;
                }
                if (a.checksum > b.checksum) {
                    return -1;
                }
            }
            if(rule.pointsPriority) {
                for (var i = curRoundSum; i > 0; i--) {
                    var roundsSumA = a.roundsSum[i] ? a.roundsSum[i] : 0;
                    var roundsSumB = b.roundsSum[i] ? b.roundsSum[i] : 0;
                    if (roundsSumA < roundsSumB) {
                        return 1;
                    }
                    if (roundsSumA > roundsSumB) {
                        return -1;
                    }
                }
            }
            return compareTableItems(a, b);
        });
        // Группировать по месту в рейтинге
        var placeGroups = [];
        data.forEach(function (item, i) {
            if (!placeGroups[item.checksum]) {
                placeGroups[item.checksum] = 0;
            }
            placeGroups[item.checksum]++;
        });
        for(var i in placeGroups) {
            placeGroups[i]--;
        }
        var place = 0;
        var placeGroup = 1;
        var curChecksum = '';
        data.forEach(function (item, i) {
            var itemExport = [];
            var itemPlace = '';
            if (curChecksum !== item.checksum) {
                place += placeGroup;
            }
            curChecksum = item.checksum;
            if (placeGroups[item.checksum] && placeGroups[item.checksum] > 0) {
                placeGroup = placeGroups[item.checksum];
                itemPlace = place + '-' + (place + placeGroup);
                placeGroup++;
            }
            else {
                placeGroup = 1;
                itemPlace = place;
            }
            itemExport.push(itemPlace);
            itemExport.push(item.name);
            var j = 0;
            rule.rounds.forEach(function (round) {
                if (typeof round === 'object') {
                    var sum = 0;
                    round.subrounds.forEach(function () {
                        var value = nonZero[j] ? item.rounds[j] : '';
                        j++;
                        sum += parseFloat(value);
                        itemExport.push(value);
                    });
                    itemExport.push(isNaN(sum) ? '' : sum);
                }
                else {
                    var value = nonZero[j] ? item.rounds[j] : '';
                    itemExport.push(value);
                    j++;
                }
            });
            itemExport.push(item.sum);
            dataExport.push(itemExport);
        });
    }
    return dataExport;
}

function download(file, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', file);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

bootbox.setDefaults({
    locale: 'ru'
});

$(function () {
    fillListFromStorage();
    $('#btn-teams-list').change(function () {
        var file = this.files ? this.files[0] : null;
        if (file && file.type === 'text/plain') {
            var reader = new FileReader();
            reader.onload = function () {
                addListToStorage(reader.result.trim().split('\n'));
                fillListFromStorage();
            };
            reader.readAsText(file);
        }
    });
    $('#btn-import-data').change(function () {
        var file = this.files ? this.files[0] : null;
        if (file) {
            var reader = new FileReader();
            reader.onload = function () {
                var data = JSON.parse(reader.result.trim());
                localStorage.setItem('teams-list', JSON.stringify(data['teams-list']));
                localStorage.setItem('table-list', JSON.stringify(data['table-list']));
                localStorage.setItem('rule', JSON.stringify(data['rule']));
                localStorage.setItem('game-name', data['game-name']);
                location.reload();
            };
            reader.readAsText(file);
        }
    });
    $('#btn-export-data').click(function () {
        download('data.json', JSON.stringify({
            'teams-list': JSON.parse(localStorage.getItem('teams-list')),
            'table-list': JSON.parse(localStorage.getItem('table-list')),
            'rule': JSON.parse(localStorage.getItem('rule')),
            'game-name': localStorage.getItem('game-name')
        }));
    });
    $('#btn-team-add').click(function () {
        addListItem();
    });
    $('#btn-team-add-text').on('keyup', function (e) {
        if (e.keyCode === 13) {
            addListItem();
        }
    });
    if (config && config.rules) {
        config.rules.forEach(function (rule, i) {
            var option = $('<option>', {
                value: i,
                selected: getRule() && getRule().name === rule.name
            }).text(rule.name).data('rule', rule);
            $('#games-list').append(option);
        });
    }
    $('#games-list').change(changeRule);
    changeRule();
    $('#game-name').val(localStorage.getItem('game-name')).keyup(function () {
        localStorage.setItem('game-name', $(this).val().trim());
    });
    $('#generate-image, #generate-image-final').click(function () {
        var isFinal = $(this).attr('id') === 'generate-image-final';
        var data = getExportData(isFinal);
        if (data.length > 0) {
            var generalStyle = $.extend({}, {
                imageWidth: 1280,
                imageHeight: 1024,
                columnWidth: 40,
                padding: 10,
                fontSize: 22,
                fontStretch: 'normal'
            }, config && config.styles ? config.styles : {});
            var rule = getRule();
            var styles = rule && rule.styles ? rule.styles : {};
            var style = $.extend({}, {
                fontFamily: 'sans-serif',
                background: '#fff',
                color: '#000',
                headerColor: '#4b4b4b',
                border: '0',
                tHeaderColor: null,
                tHeaderBackground: null,
                cellColor: null,
                cellBackground: null,
                oddCellColor: null,
                oddCellBackground: null
            }, styles);
            if (!style.tHeaderColor) {
                style.tHeaderColor = style.color;
            }
            if (!style.tHeaderBackground) {
                style.tHeaderBackground = style.background;
            }
            if (!style.cellColor) {
                style.cellColor = style.color;
            }
            if (!style.cellBackground) {
                style.cellBackground = style.background;
            }
            if (!style.oddCellColor) {
                style.oddCellColor = style.color;
            }
            if (!style.oddCellBackground) {
                style.oddCellBackground = style.background;
            }
            var roundStyles = [];
            var table = $('<table>', {
                width: '100%'
            });
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var tr = $('<tr>').appendTo(table);
            canvas.width = generalStyle.imageWidth;
            canvas.height = generalStyle.imageHeight;
            $('<th>', {
                align: 'center',
                width: generalStyle.columnWidth
            }).appendTo(tr).text('Место');
            $('<th>', {
                align: 'left',
                width: canvas.width - generalStyle.padding - generalStyle.columnWidth * (2 + rule.roundsCount)
            }).appendTo(tr).text('Команда');
            rule.rounds.forEach(function (round) {
                if (typeof round === 'object') {
                    var roundStyle = $.extend({}, {
                        background: style.background,
                        color: style.color,
                        tHeaderColor: style.tHeaderColor,
                        columnWidth: generalStyle.columnWidth
                    }, round.styles ? round.styles : {});
                    round.subrounds.forEach(function (subround) {
                        $('<th>').css({
                            background: roundStyle.subroundsBackground ? roundStyle.subroundsBackground : roundStyle.background,
                            color: roundStyle.subroundsTHeaderColor ? roundStyle.subroundsTHeaderColor : roundStyle.tHeaderColor,
                            width: roundStyle.columnWidth
                        }).appendTo(tr).html(subround);
                        roundStyles.push({
                            background: roundStyle.subroundsBackground ? roundStyle.subroundsBackground : roundStyle.background,
                            color: roundStyle.subroundsColor ? roundStyle.subroundsColor : roundStyle.color
                        });
                    });
                    $('<th>').css({
                        background: roundStyle.background,
                        color: roundStyle.tHeaderColor,
                        width: roundStyle.columnWidth
                    }).appendTo(tr).html(round.name);
                    roundStyles.push({
                        background: roundStyle.background,
                        color: roundStyle.color
                    });
                }
                else {
                    $('<th>', {
                        width: generalStyle.columnWidth
                    }).appendTo(tr).html(round);
                    roundStyles.push(null);
                }
            });
            $('<th>', {
                width: generalStyle.columnWidth
            }).appendTo(tr).text('Сумма');
            data.forEach(function (item) {
                var place = item.splice(0, 1);
                place = isFinal ? '' : place;
                var name = item.splice(0, 1);
                var tr = $('<tr>', {
                    'data-text': name
                }).appendTo(table).data('text', name);
                $('<td>', {
                    align: 'center'
                }).appendTo(tr).text(place);
                $('<td>', {
                    align: 'left'
                }).appendTo(tr).text(name);
                item.forEach(function(field, i) {
                    var styles = roundStyles[i] ? roundStyles[i] : {};
                    if(rule.roundsPriority && maxRoundValues[i] === field) {
                        styles.fontWeight = 'bold';
                        styles.color = style.priorityColor ? style.priorityColor : style.color;
                    }
                    $('<td>', {
                        align: 'center'
                    })
                        .css(styles)
                        .appendTo(tr)
                        .text(('' + field).replace('.', ','));
                });
            });
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var cdata = '<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.width + '" height="' + canvas.height + '">\
                <foreignObject width="100%" height="100%" style="background: ' + style.background + '; color: ' + style.color + ';">\
                    <style>\
                        .overlay {\
                            font-size: ' + generalStyle.fontSize + 'px;\
                            font-stretch: ' + generalStyle.fontStretch + ';\
                            font-family: ' + style.fontFamily + ';\
                            padding: ' + generalStyle.padding + 'px;\
                        }\
                        .overlay > div {\
                            padding: 0 8px;\
                            margin-bottom: 10px;\
                            color: ' + style.headerColor + ';\
                        }\
                        th, td {\
                            padding: 4px 8px;\
                            vertical-align: top;\
                            color: ' + style.cellColor + ';\
                            background: ' + style.cellBackground + ';\
                        }\
                        tr:nth-child(odd) td {\
                            color: ' + style.oddCellColor + ';\
                            background: ' + style.oddCellBackground + ';\
                        }\
                        table, th, td {\
                            border: ' + style.border + ';\
                        }\
                        th {\
                            color: ' + style.tHeaderColor + ';\
                            background: ' + style.tHeaderBackground + ';\
                        }\
                    </style>\
                    <div xmlns="http://www.w3.org/1999/xhtml" class="overlay">\
                        <div>' + $('#game-name').val() + '</div>\
                        ' + table.html() + '\
                    </div>\
                </foreignObject>\
            </svg>';
            var DOMURL = self.URL || self.webkitURL || self;
            var img = new Image();
            var svg = new Blob([cdata], {
                type: 'image/svg+xml;charset=utf-8'
            });
            var url = DOMURL.createObjectURL(svg);
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
            };
            img.src = url;
            $(canvas).show();
        }
    });
    $('#generate-csv').click(function () {
        var data = getExportData();
        if (data.length > 0) {
            var dataExport = [
                ['Место', 'Команда']
            ];
            var rule = getRule();
            rule.rounds.forEach(function (round) {
                if (typeof round === 'object') {
                    round.subrounds.forEach(function (subround) {
                        dataExport[0].push(subround);
                    });
                    dataExport[0].push(round.name);
                }
                else {
                    dataExport[0].push(round);
                }
            });
            dataExport[0].push('Сумма');
            dataExport[0] = dataExport[0].join(';');
            data.forEach(function (item) {
                dataExport.push(item.join(';'));
            });
            download('data.csv', dataExport.join('\n'));
        }
    });
    $('#empty-table').click(function () {
        bootbox.confirm('Вы действительно хотите очистить таблицу результатов?', function (e) {
            if (e) {
                localStorage.setItem('table-list', '');
                location.reload();
            }
        });

    });
});