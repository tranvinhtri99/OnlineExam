import {MatSnackBar} from "@angular/material/snack-bar";
import {AppInjector} from "../../app.module";
import {MatSnackBarRef} from "@angular/material/snack-bar/snack-bar-ref";
import {TextOnlySnackBar} from "@angular/material/snack-bar/simple-snack-bar";
import {mergeScan} from "rxjs/operators";

export type TypeSnackbar = "warning" | "error" | "success";


function getSnackbar() {
  return AppInjector.get(MatSnackBar)
}


export function showSnackbar(message:string, type: TypeSnackbar = "success"):MatSnackBarRef<TextOnlySnackBar>{
  return getSnackbar().open(message, "x", {
    duration: 3000,
    horizontalPosition: "right",
    verticalPosition:"top",
    panelClass:type
  })
}

export const snackbarError = (message:string) => showSnackbar(message, "error");
export const snackbarWarning = (message:string) => showSnackbar(message, "warning");
export const snackbarSuccess = (message:string) => showSnackbar(message);



