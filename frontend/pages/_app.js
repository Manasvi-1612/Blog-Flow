import './style.css'
import CustomCursor from '../components/CustomCursor'


export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <CustomCursor />
      <Component {...pageProps} />
    </>
  )
}