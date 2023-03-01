export interface Content {
    title?: string;
    threads_id: string;
    content: string;
    created_datetime: Date;
    contents_id: string;
    lastname: string;
    firstname: string;
    profile_picture_location: string;
    users_id: string;
    categorie: string;
    categorieSlug: string;
    nbLike?: Number;
    isLiked?: Number;
}
