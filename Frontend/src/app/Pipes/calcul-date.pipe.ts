import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "calculDate",
})
export class CalculDatePipe implements PipeTransform {
    transform(value: any) {
        let currentDate = new Date();

        let dateSent = new Date(value);

        let diff = currentDate.getTime() - dateSent.getTime();

        if (diff < 60000) {
            return Math.floor(diff / (1000)) + " sec";
        } else if (diff < 3600000) {
            return Math.floor(diff / (1000 * 60 )) + " min";
        } else if (diff < 86400000) {
            return Math.floor(diff / (1000 * 60 * 60)) + " h";
        } else {
            return Math.floor(diff / (1000 * 60 * 60 * 24)) + " j";
        }
    }
}
