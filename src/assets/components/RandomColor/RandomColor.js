
export const RandomColor = (ind) => {
  let colorsArray=['#00b894','#ff7675','#81ecec','#74b9ff','#fd79a8','#a29bfe']
  let indz=Math.floor(Math.random() * colorsArray?.length-1) + 1;
  return colorsArray[indz]
}
