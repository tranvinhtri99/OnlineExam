export class CreateAccountModel {
  public type:TypeAccount = TypeAccount.Student;
  public username?:string;
  public name?:string;
  public password?:string;
  public classroomId?:number;
}

export enum TypeAccount{
  Student,
  Lecturer,
  Admin
}

export function convertTypeAccount(type:string):TypeAccount{
  switch (type){
    case "Student":
    case "student":
      return TypeAccount.Student;
    case "Lecturer":
    case "lecturer":
      return TypeAccount.Lecturer;
    case "Admin":
    case "admin":
      return TypeAccount.Admin;
  }
  return TypeAccount.Student;
}

export class TypeAccountString{
  public static Student = "Student";
  public static Lecturer = "Lecturer";
  public static Admin = "Admin";
}

export type Dictionary<TKey, TValue> = {key:TKey, value:TValue};

export const statesTypeAccount:Dictionary<number, string>[] = (Object.values(TypeAccount).filter(value => typeof value === 'number') as number[])
  .map(x => { return  {key:x, value:TypeAccount[x]}})
