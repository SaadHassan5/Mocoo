export function _returnAddress (addressObject){
    console.log('addressObject:', addressObject.results[0]);
    let returnAddress = {
      street_number: null,
      street_address: null,
      fulladdress: addressObject?.results[0]?.formatted_address,
      geoCode: {
        ...addressObject.results[0]?.geometry?.location,
      },
      place_id: addressObject.results[0]?.place_id,
      province: null,
      district: null,
      tehsil: null,
      city: null,
      area: null,
      country: null,
      country_short_name: null
    };
    addressObject.results?.forEach((element) => {
      element?.address_components?.forEach((item) => {
        if (item.types.some((el) => el === 'administrative_area_level_1')) {
          returnAddress = { ...returnAddress, province: item.long_name };
        } else if (
          item.types.some((el) => el === 'administrative_area_level_2')
        ) {
          returnAddress = { ...returnAddress, district: item.long_name };
        } else if (
          item.types.some((el) => el === 'administrative_area_level_3')
        ) {
          returnAddress = { ...returnAddress, tehsil: item.long_name };
        } else if (item.types.some((el) => el === 'locality')) {
          returnAddress = { ...returnAddress, city: item.long_name };
        } else if (item.types.some((el) => el === 'sublocality')) {
          returnAddress = { ...returnAddress, area: item.long_name };
        } else if (item.types.some((el) => el === 'street_address')) {
          returnAddress = {
            ...returnAddress,
            street_address: item.long_name || null,
          };
        } else if (item.types.some((el) => el === 'street_number')) {
          returnAddress = {
            ...returnAddress,
            street_number: item.long_name || null,
          };
        } else if (item.types.some((el) => el === 'country')) {
          returnAddress = {
            ...returnAddress,
            country: item.long_name || null,
            country_short_name: item?.short_name,
          };
        }
      });
    });
    return returnAddress;
  }