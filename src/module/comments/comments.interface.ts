import type { Status } from "../../../generated/prisma/enums";

export interface ICreateCommentPayload {
    postId: string;
    authorId: string;
    content: string;
}


export interface ICommentPayload{
        content ?: string, 
    status ?: Status

}