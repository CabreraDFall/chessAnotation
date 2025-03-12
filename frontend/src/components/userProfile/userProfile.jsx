import './userProfile.css';

const UserProfile = ({ user }) => {
  const defaultUser = {
    avatar: '/default-avatar.png',
    name: 'User',
    nickname: 'El Gato', 
    history: 'v-10',
    // Add other default properties as needed
  };

  const userData = { ...defaultUser, ...(user || {}) };

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <img />
        <h2>{userData.name}</h2>
        <p>{userData.nickname}</p>
        <small>{userData.history}</small>
      </div>
    </div>
  );
};

export default UserProfile;