interface GlobalUser  {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  contests: mongoose.Types.ObjectId[];
  full_name: string;
}
