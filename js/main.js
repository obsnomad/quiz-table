function array_unique(arr) {
    var tmp_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmp_arr.indexOf(arr[i]) == "-1") {
            tmp_arr.push(arr[i]);
        }
    }
    return tmp_arr;
}

function fillListFromStorage() {
    var data = localStorage.getItem('teams-list');
    data = data ? JSON.parse(data) : [];
    if (data.length > 0) {
        var ul = $('#teams-list').html('');
        for (var i in data) {
            var text = data[i].trim();
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
            });
            var del = $('<a>', {
                class: 'team-btn team-delete'
            }).click(function () {
                var parent = $(this).parents('li').first();
                bootbox.confirm('Вы действительно хотите удалить команду?', function (e) {
                    if (e) {
                        parent.slideUp('fast', function () {
                            $(this).remove();
                            updateList();
                        });
                    }
                });
            });
            li.append($('<span>').text(text)).append(edit).append(add).append(del);
            ul.append(li);
        }
    }
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

function changeRule() {
    var select = $('#games-list');
    var current = $('option[value=' + select.val() + ']', select);
    localStorage.setItem('rule', JSON.stringify(current.data('rule')));
    getRule();
}

function getRule() {
    var data = localStorage.getItem('rule');
    return data ? JSON.parse(data) : {};
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
    $('#btn-team-add').click(function () {
        addListItem();
    });
    $('#btn-team-add-text').on('keyup', function (e) {
        if (e.keyCode === 13) {
            addListItem();
        }
    });
    if(config && config.rules) {
        config.rules.forEach(function(rule, i) {
            var option = $('<option>', {
                value: i,
                selected: getRule() && getRule().name === rule.name
            }).text(rule.name).data('rule', rule);
            $('#games-list').append(option);
        });
    }
    $('#games-list').change(changeRule);
    changeRule();
});