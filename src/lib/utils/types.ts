interface ItemLogDTO {
    item_id: string;
    note: string;
    ref: string;
    activity: string;
    user_id: string;
}

interface UserLogDTO {
    device: string;
    version: string;
    activity: string;
    user_id: string;
    ref: string,
    note: string
}
