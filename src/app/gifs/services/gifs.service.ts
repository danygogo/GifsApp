import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';


@Injectable({
  providedIn: 'root' //Esto hace que no se tenga que importar en los modulos
})
export class GifsService {
  private apiKey: string = "lGaaJCIoMsDZ0ONPCPSX3Y5nHB5IOJMh"
  private _historial: string[] = []

  public resultados: Gif[] =[]
  
  get historial(){
    console.log("se ejecuta el get, creo que esto va después del buscarGifs")
    
    return [...this._historial]
    //sin los 3 puntos funciona pero al romper la relación
    //hace que el arreglo original no se pueda modificar
  }

  constructor(private http: HttpClient){
    if(localStorage.getItem("historial")){
      this._historial = JSON.parse(localStorage.getItem("historial")!)   //El signo de admiración hace que TS no de problemas debido a que eso podría en teoria enviar un null cuando en el arreglo no se puede meter 
    }
  }


  buscarGifs(query: string = ""){

    query = query.trim().toLowerCase()

    if (!this._historial.includes(query)){
      this._historial.unshift(query);
    }
    
    this._historial = this._historial.splice(0,10)

    localStorage.setItem("historial", JSON.stringify(this._historial))//Set item solamente maneja strings, es por eso que para guardar todo el arreglo se usa stringify
  
    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=lGaaJCIoMsDZ0ONPCPSX3Y5nHB5IOJMh&q=${query}&limit=10`)
        .subscribe((resp) => {
          console.log(resp.data);
          console.log("La respuesta es: " + resp)
          this.resultados = resp.data;
        })

        
        
  }


}


//lGaaJCIoMsDZ0ONPCPSX3Y5nHB5IOJMh