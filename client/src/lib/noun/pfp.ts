const NOUN_PFP_BASE_API = "https://noun-api.com/beta/pfp";

export const generatePfp = async (address: string, size: number = 48) => {
  try {
    const response = await fetch(
      `${NOUN_PFP_BASE_API}?name=${address}&size=${size}`
    );

    return response;
  } catch (error) {}
};
