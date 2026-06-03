export interface Kunde{
    id: number;
    email: string;
    passwort?: string;  //Registierung/Login

    vorname: string;
    nachname: string;
    adresse: string;
    plz: string;
    ort: string;
    istAdmin: boolean;

}