import { h, Fragment } from 'preact';

export function Media({media, inQuote}: {media: {url: string}[], inQuote?: boolean}) {
  if(media.length == 0) return null;
  let component; 
  switch (media.length) {
    case 1:
      component = <SingleMedia url={media[0].url} />
      break;
    case 2:
      component =  <DoubleMedia url1={media[0].url} url2={media[1].url}/>
      break;
    case 3:
      component =  <TripleMedia url1={media[0].url} url2={media[1].url} url3={media[2].url}/>
      break;
    case 4:
    default:
      console.log(media)
      component = <QuadrupleMedia url1={media[0].url} url2={media[1].url} url3={media[2].url} url4={media[3].url}/>
  }

  return (
      <div class="mt-3 cursor-pointer">
      <div class={`overflow-hidden relative ${inQuote ? ' rounded-b-2xl' : ' rounded-2xl'}`}>
        <div class="w-full" style="padding-bottom: 56.25%"></div>
        {component}
      </div>
    </div>
  )
}


function SingleMedia({url}: {url: string}) {
  return (
    <div class="w-full absolute inset-0" style="margin-bottom: -89%">
      <div class="absolute inset-0 bg-cover bg-no-repeat bg-center" style={`background-image: url('${url}')`}>
        <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url} />
      </div>
    </div>
  )
}

function DoubleMedia({url1, url2}: {url1: string, url2: string}) {
  return (
    <div class="w-full absolute inset-0">
      <div class="w-full h-full flex flex-row">
        <div class="flex-1 relative mr-0.5">
          <div 
            class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
            style={`background-image: url('${url1}')`}>
          </div>
          <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url1} />
        </div>
        <div class="flex-1 relative">
          <div 
            class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
            style={`background-image: url('${url2}')`}>
          </div>
          <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url2} />
        </div>
      </div>
    </div>
  )
}

function TripleMedia({url1, url2, url3}: {url1: string, url2: string, url3: string}) {
    return (
      <div class="w-full absolute inset-0">
        <div class="w-full h-full flex flex-row">
          <div class="flex-1 relative mr-0.5">
            <div 
              class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
              style={`background-image: url('${url1}')`}>
            </div>
            <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url1} />
          </div>
          <div class="flex-1 relative">
            <div class="w-full h-full flex flex-col">
              <div class="flex-1 relative mb-0.5">
                <div 
                  class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
                  style={`background-image: url('${url2}')`}></div>
                <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url2} />
              </div>
              <div class="flex-1 relative">
                <div 
                  class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
                  style={`background-image: url('${url3}')`}></div>
                <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

function QuadrupleMedia({url1, url2, url3, url4}: {url1: string, url2: string, url3: string, url4: string}) {
    return (
      <div class="w-full absolute inset-0">
        <div class="w-full h-full flex flex-row">
          <div class="flex-1 relative mr-0.5">
            <div class="w-full h-full flex flex-col">
              <div class="flex-1 relative mb-0.5">
                <div 
                  class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
                  style={`background-image: url('${url1}')`}></div>
                <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url1} />
              </div>
              <div class="flex-1 relative">
                <div 
                  class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
                  style={`background-image: url('${url2}')`}></div>
                <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url2} />
              </div>
            </div>
          </div>
          <div class="flex-1 relative">
            <div class="w-full h-full flex flex-col">
              <div class="flex-1 relative mb-0.5">
                <div 
                  class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
                  style={`background-image: url('${url3}')`}></div>
                <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url3} />
              </div>
              <div class="flex-1 relative">
                <div 
                  class="absolute inset-0 bg-cover bg-no-repeat bg-center w-full h-full" 
                  style={`background-image: url('${url3}')`}></div>
                <img class="absolute inset-0 w-full h-full" style="z-index: -1" src={url3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}