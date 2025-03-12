const users = [
    {
        id: 1,
        name: 'Jon',
        age: 39,
    },
    {
        id: 2,
        name: 'Doe',
        age: 15,
    },
];

const getUser = (index) => {
    return users[index];
}

module.exports = {users,getUser};