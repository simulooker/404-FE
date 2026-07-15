import profile1 from "../assets/profile/roundprofile/basic1.png";
import profile2 from "../assets/profile/roundprofile/basic2.png";
import profile3 from "../assets/profile/roundprofile/basic3.png";
import profile4 from "../assets/profile/roundprofile/basic4.png";

const profileAvatars = [profile1, profile2, profile3, profile4];

export function getProfileAvatar(userId: number) {
  const index = Math.abs(userId - 1) % profileAvatars.length;
  return profileAvatars[index];
}
