var config = {
    styles: {
        imageWidth: 1920,
        imageHeight: 1080,
        columnWidth: 100,
        padding: 8,
        fontSize: 48
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
            styles: {
                fontFamily: 'Oranienbaum, serif',
                background: '#0f234f',
                color: '#fff',
                tHeaderColor: '#d3b458',
                headerColor: '#c6c6c6',
                border: '1px solid #2454be'
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
        }
    ]
};