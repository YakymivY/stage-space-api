const users = [];

//DATABASE
const mongFollow = require('../schemas/follow');
//

//join user to chat 
export function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

//get the current user
export function getCurrentUser (id) {
    return users.find(user => user.id === id);
}

//user leaves the chat
export function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//get room users 
export function getRoomUsers (room) {
    return users.filter(user => user.room === room);
}

//get user followings
export async function getFollowings (followerId: string) {
    const followingsArray = [];
    const followings = await mongFollow.find({follower: followerId}).populate('follower');
    followings.forEach(item => followingsArray.push(item.following));
    return followingsArray;
}