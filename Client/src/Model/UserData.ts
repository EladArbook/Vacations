//Server response for logging in:

interface UserData {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
    vacationFollowed: JSON;
}

export default UserData;