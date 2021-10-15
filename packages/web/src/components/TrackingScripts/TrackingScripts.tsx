import Script from 'next/script';

export const TrackingScripts = (): JSX.Element => {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-MP7CRCPJ6R" />
      <Script id="gtag">
        {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-MP7CRCPJ6R');`}
      </Script>
    </>
  );
};
