export type Member = {
    id: string
    dateOfBirth: string
    imageUrl: string
    displayName: string
    created: string
    lastActive: string
    gender: string
    description?: string
    city: string
    country: string
}


export type EditableMember =
    {
        displayName: string;
        description: string;
        city: string;
        country: string
    }

export class MemberFilterParams {
    gender: string = '';
    minAge: number = 18;
    maxAge: number = 99;
    pageNumber: number = 1;
    pageSize: number = 5;
    orderBy: string = 'lastActive';
}   