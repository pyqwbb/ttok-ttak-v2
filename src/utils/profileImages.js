import default1 from '@/assets/profiles/default_1.svg';
import default2 from '@/assets/profiles/default_2.svg';
import default3 from '@/assets/profiles/default_3.svg';
import default4 from '@/assets/profiles/default_4.svg';

export const PROFILE_IMAGES = {
  'default_1.svg': default1,
  'default_2.svg': default2,
  'default_3.svg': default3,
  'default_4.svg': default4,
};

export const getProfileImage = (fileName) => {
  return PROFILE_IMAGES[fileName] || default1;
};
