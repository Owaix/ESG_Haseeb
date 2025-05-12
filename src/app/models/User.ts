export class User {
    token: string = '';
    email: string = '';
    name: string = '';
    password: string = '';
    confirm_password: string = '';
    phoneno: string = '';
    company_info: Company_Info = new Company_Info();
}
export class Company_Info {
    company_name: string = '';
    category_id: number = 0;
    type_id: number = 0;
    sector_id: number = 0;
}
export class Category {
    id: number = 0;
    name: string = '';
    sectors: CategorySector[] = [];
    types: CategoryType[] = [];
}
export class CategoryType {
    id: number = 0;
    type: string = '';
}
export class CategorySector {
    id: number = 0;
    name: string = '';
}