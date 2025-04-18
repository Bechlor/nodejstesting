export const messages = (lang = "en") => {
  const successResponse = {
    en:"success",
    hi:"सफलता"
  }
  return{
    successResponse:successResponse[lang],
  }
}