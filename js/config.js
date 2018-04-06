var config = {
    styles: {
        imageWidth: 1280,
        imageHeight: 1024,
        columnWidth: 80,
        padding: 8,
        //fontStretch: 'ultra-condensed',
        fontSize: 30
    },
    rules: [
        {
            name: 'Мелотрек',
            rounds: [
                1,
                2,
                3,
                4,
                5,
                6,
                7
            ],
            finalRounds: 2,
            styles: {
                fontFamily: 'Oranienbaum, serif',
                background: '#302212',
                color: '#fff',
                tHeaderColor: '#d3b458',
                headerColor: '#c6b27c',
                border: '1px solid #100b06'
            }
        },
        {
            name: 'Кинотрек',
            rounds: [
                1,
                2,
                3,
                4,
                5,
                6,
                7
            ],
            finalRounds: 2,
            goldPriority: true,
            goldRounds: [
                6
            ],
            silverRounds: [
                5
            ],
            bronzeRounds: [
                2
            ],
            styles: {
                fontFamily: 'Oranienbaum, serif',
                background: '#0f234f',
                color: '#fff',
                tHeaderColor: '#d3b458',
                headerColor: '#c6c6c6',
                border: '1px solid #2454be',
                gold: '#ffef36',
                goldColor: '#000',
                silver: '#c9cbc9',
                silverColor: '#000',
                bronze: '#ce8737',
                bronzeColor: '#000'
            }
        },
        {
            name: 'Jack Quiz',
            rounds: [
                1,
                2,
                3,
                4,
                5,
                6,
                {
                    name: '&Sigma;A',
                    styles: {
                        background: '#373737',
                        subroundsBackground: '#585858'
                    },
                    subrounds: [
                        'A1',
                        'A2',
                        'A3',
                        'A4',
                        'A5'
                    ]
                }
            ],
            finalRounds: 1,
            pointsPriority: true,
            styles: {
                fontFamily: 'Myriad Pro, sans-serif',
                background: '#000',
                color: '#fff',
                headerColor: '#c6c6c6',
                border: '1px solid #000'
            }
        },
        {
            name: 'Лига Индиго',
            rounds: [
                'Раунд 1',
                'Раунд 2',
                'Раунд 3',
                'Раунд 4',
                'Раунд 5'
            ],
            roundsPriority: true,
            pointsPriority: true,
            styles: {
                fontFamily: 'Arial, sans-serif',
                background: '#ffffff',
                cellBackground: '#cdc0da',
                oddCellBackground: '#e6e0ec',
                color: '#0e0100',
                priorityColor: '#4b0081',
                tHeaderColor: '#ffffff',
                tHeaderBackground: '#4b0081',
                headerColor: '#4b0081',
                border: '1px solid #000'
            }
        }
    ]
};