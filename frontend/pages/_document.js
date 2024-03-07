import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="UTF-8" />
                <meta content="width=device-width, initial-scale=1.0" />

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossOrigin="anonymous" />

                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" />

                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-quill/1.0.0-beta-2/quill.snow.css" />
                <link href='https://fonts.googleapis.com/css?family=Odibee Sans' rel='stylesheet'></link>

                {/* <link
                    href="https://fonts.googleapis.com/css?family=Lato:300,400|Poppins:300,400,800&display=swap"
                    rel="stylesheet"
                /> */}
{/* 
                <link
                    href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap"
                    rel="stylesheet"
                /> */}

            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}


