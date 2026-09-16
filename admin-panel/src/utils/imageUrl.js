export const getImageUrl = (avatarPath) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
  return `http://localhost:5000${cleanPath}`;
};
