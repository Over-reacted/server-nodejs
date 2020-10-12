interface KeyProps {
  jwtSecret: string;
  dbHost: string | undefined;
}

export const Keys: KeyProps = {
  jwtSecret: process.env.JWT_SECRET ?? "asdf",
  dbHost: process.env.DB_HOST,
};
