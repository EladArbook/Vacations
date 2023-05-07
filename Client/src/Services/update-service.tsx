import { io, Socket } from "socket.io-client";

class UpdateService {

    public socket: Socket | undefined;

    public connect(): void {
        this.socket = io("ws://localhost:3800");
    }

    public disconnect(): void {
        this.socket?.disconnect();
    }

    //send admin's change to the server
    public send(id: number): void {
        this.socket?.emit("info-update", id);
    }

}
//creating a connection in VacationPage and ChangeVacation 
export default UpdateService;