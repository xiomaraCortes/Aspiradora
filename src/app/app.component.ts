import { Component } from '@angular/core';
import { Entidad } from "./model/entidad";
import { EnumState } from "./model/enumState";
import { timer } from 'rxjs';
import { take } from "rxjs/operators";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Aspiradora';
  aspiradoraUno = false;
  aspiradoraDos = false;
  basuraUno = false;
  basuraDos = false;
  localizacion: string = 'A';
  estado: string = 'ambos lados';
  mensajeBasura = '';
  mensajeResult = '';

  process(): void {
    this.mensajeResult='';
    this.hideElements();
    const entidad = new Array<Entidad>();
    switch (this.estado) {
      case 'ambos lados':
        entidad.push(new Entidad("A", EnumState.DIRTY));
        entidad.push(new Entidad("B", EnumState.DIRTY));
        this.basuraUno = true;
        this.basuraDos = true;
        this.mensajeBasura = "A:" + EnumState.DIRTY + ", B:" + EnumState.DIRTY;
        break;
      case "un solo lado":
        const random = parseInt((Math.random() * (3 - 1) + 1).toString());
        console.log(random);
        if (random == 1) {
          this.basuraUno = true;
          entidad.push(new Entidad("A", EnumState.DIRTY));
          entidad.push(new Entidad("B", EnumState.CLEAN));
          this.mensajeBasura = "A:" + EnumState.DIRTY + ", B:" + EnumState.CLEAN;
        } else if (random == 2) {
          this.basuraDos = true;
          entidad.push(new Entidad("A", EnumState.CLEAN));
          entidad.push(new Entidad("B", EnumState.DIRTY));
          this.mensajeBasura = "A:" + EnumState.CLEAN + ", B:" + EnumState.DIRTY;
        }
        break;
      default:
        entidad.push(new Entidad("A", EnumState.CLEAN));
        entidad.push(new Entidad("B", EnumState.CLEAN));
        this.mensajeBasura = "A:" + EnumState.CLEAN + ", B:" + EnumState.CLEAN;
        break;
    }
    this.showOrHideAspiradora();
    setTimeout(() => { this.doCalculate(entidad, this.localizacion) }, 3000);
  }

  private showOrHideAspiradora(): void {
    switch (this.localizacion) {
      case "A":
        this.aspiradoraUno = true;
        break;
      case "B":
        this.aspiradoraDos = true;
        break;
    }
  }

  async doCalculate(entidad: Array<Entidad>, position: string) {
    const result = '';
    if (this.localizacion === position) {
      for (let i = 0; i < entidad.length; i++) {
        await timer(1000).pipe(take(1)).toPromise();
        this.mensajeResult = this.mensajeResult + this.validatyCase(entidad[i].state, i, i + 1, this.localizacion);
        await timer(3000).pipe(take(1)).toPromise();
      }

    } else {
      for (let i = 1; i >= 0; i--) {
        await timer(1000).pipe(take(1)).toPromise();
        this.mensajeResult = this.mensajeResult + this.validatyCase(entidad[i].state, i, i - 1, this.localizacion);
        await timer(3000).pipe(take(1)).toPromise();
      }
    }
  }

  validatyCase(state: string, comparadorActual: number, comparadorSiguiente: number, posicionActual: string): string {
    switch (state) {
      case "Sucio":
        if (comparadorActual == 0) {
          this.basuraUno = false;
        } else {
          this.basuraDos = false;
        }
        return "Aspire" + "\r\n" + this.calcularMovimiento(posicionActual, comparadorActual, comparadorSiguiente);
      case "Limpio":
        return "" + "\r\n" + this.calcularMovimiento(posicionActual, comparadorActual, comparadorSiguiente);
      default:
        return "";
    }
  }

  calcularMovimiento(posicionActual: string,  comparadorActual:number,  comparadorSiguiente:number):string {
    var movimiento = "";
    if (posicionActual === 'A') {
        if (comparadorActual == 0 && comparadorSiguiente == 1 && comparadorSiguiente < 2) {
            this.aspiradoraUno =false;
            this.aspiradoraDos=true;
            movimiento = "Move right ";
        } else {
            movimiento = "";
        }
    } else if (comparadorActual == 1 && comparadorSiguiente == 0 && comparadorSiguiente >= 0) {
        this.aspiradoraUno=true;
        this.aspiradoraDos=false;
        movimiento = "Move left";
    } else {
        movimiento = "";
    }
    return movimiento;
}


  private hideElements() {
    this.aspiradoraUno = false;
    this.aspiradoraDos = false;
    this.basuraUno = false;
    this.basuraDos = false;
  }

  selectChangeHandler(event: any) {
    //update the ui
    this.localizacion = event.target.value;
  }

  selectChangeHandlerState(event: any) {
    //update the ui
    this.estado = event.target.value;
  }
}

