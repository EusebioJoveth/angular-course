export interface User {
  id: string;
  idCompany:string;
  avatar: string;
  name: string;
  email:string
  admin?:boolean;
  online?:number;
  accessToken?:string;


}
