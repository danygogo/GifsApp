import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';


@Injectable({
  providedIn: 'root' //Esto hace que no se tenga que importar en los modulos
})
export class GifsService {
  private apiKey: string = "lGaaJCIoMsDZ0ONPCPSX3Y5nHB5IOJMh";
  private servicioUrl: string = "https://api.giphy.com/v1/gifs";
  private _historial: string[] = []
  public resultados: Gif[] =[]
  private getLast: string = "";
  

  get historial(){
    return [...this._historial]
    //sin los 3 puntos funciona pero al romper la relación
    //hace que el arreglo original no se pueda modificar
  }

  constructor(private http: HttpClient){
    if(localStorage.getItem("historial")){
      this._historial = JSON.parse(localStorage.getItem("historial")!)   //El signo de admiración hace que TS no de problemas debido a que eso podría en teoria enviar un null cuando en el arreglo no se puede meter 
    }

    if(localStorage.getItem("last") != null){
      this.getLast = JSON.parse(localStorage.getItem("last")!)
      this.buscarGifs(this.getLast)
    }
  }


  buscarGifs(query: string = ""){

    query = query.trim().toLowerCase()

    if (!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10)
      localStorage.setItem("historial", JSON.stringify(this._historial))//Set item solamente maneja strings, es por eso que para guardar todo el arreglo se usa stringify
    }
    localStorage.setItem("last",JSON.stringify(query));
    
    const params = new HttpParams()
    .set("api_key", this.apiKey)
    .set("limit","10")
    .set("q", query)
    console.log(params.toString())
    
  
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
        .subscribe((resp) => {
          console.log(resp.data);
          console.log("La respuesta es: " + resp)
          this.resultados = resp.data;
        })

        
        
  }


}//Fin de la clase


