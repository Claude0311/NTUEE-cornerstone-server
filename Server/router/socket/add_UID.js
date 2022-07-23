/**
 * @api {socket} add_UID addUID
 * @apiGroup Socket
 * @apiDescription 新增RFID UID
 * @apiparam {String} uid_str 16進制8位數
 * 
 * @apiSuccess (uid not found) {Socket.emit} UID_added "uid not found"
 * 
 * @apiSuccess (uid already visited) {Socket.emit} UID_added "uid already visited."
 * 
 * @apiSuccess (add points) {Socket.emit} UID_added "Add x pts at y sec"
 * @apiSuccess (add points) {Socket.broadcast} UID_added {point}
 */
const add_UID = ({uids,socket})=>{
    return (data) => {
        const team = db.current.find(({id})=>id===socket.id)
        console.log("UID:",data.uid_str);
        //convert to upper case
        data.uid_str = data.uid_str.toUpperCase();
        // UID not found
        if (!uids[data.uid_str]) {
            socket.emit("UID_added", "uid not found.");
        } 
        // UID already visited
        else if (team.visited[data.uid_str]) {
            socket.emit("UID_added", "uid already visited.");
        } 
        // new valid UID
        else {
            team.status.point += uids[data.uid_str];
            team.status.last_eaten_time = team.time_remaining;
            team.visited[data.uid_str] = true;
            const msg = `${team.current_team} added ${uids[data.uid_str]} points at ${
                team.time_remaining
            } seconds left.`
            db.current = db.current.map(data => data.id === socket.id ? team : data)
            socket.emit("UID_added",msg)
            socket.broadcast.emit("UID_added", { id:team.id, point: team.status.point });
            console.log(msg)
        }
    }
}

module.exports = add_UID