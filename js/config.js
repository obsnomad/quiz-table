var config = {
    styles: {
        imageWidth: 1280,
        imageHeight: 1024,
        columnWidth: 60,
        padding: 15,
        fontSize: 32
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
            styles: {
                fontFamily: 'Oranienbaum, serif',
                background: '#272727',
                color: '#fff',
                tHeaderColor: '#d3b458',
                headerColor: '#c6c6c6',
                border: '1px solid #000'
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
                    subrounds: [
                        'A1',
                        'A2',
                        'A3',
                        'A4',
                        'A5'
                    ]
                }
            ],
            styles: {
                fontFamily: 'Oranienbaum, serif',
                background: '#000',
                color: '#fff',
                headerColor: '#c6c6c6',
                border: '1px solid #000'
            }
        }
    ]
};