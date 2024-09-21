export const generatePfp = async (address: string, size: number = 48) => {
  try {
    const response = await fetch(`/api/noun?address=${address}`);
    return await response.text();
  } catch (error) {
    return "";
  }
};
