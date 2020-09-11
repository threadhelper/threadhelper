// from chrome storage change
import {stream} from 'kefir';

export const makeOptionsObs = () =>{

  return stream(emitter => {
    return  ()=>{null}
  })
}