export type PersonType = {
  name: string;
  preferredUsername: string;
};

export type ReactionType = {
  reactionType: string;
};

export type PostType = {
  content: string;
  image: string;
};

export type WorldIdProof = {
  root: bigint;
  nullifierHash: bigint;
  proof: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];
};
