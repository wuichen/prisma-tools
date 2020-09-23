import decodeAccessToken from './decodeAccessToken';

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

function assign(obj, prop, value) {
  if (typeof prop === 'string') prop = prop.split('.');

  if (prop.length > 1) {
    const e = prop.shift();
    assign(
      (obj[e] =
        Object.prototype.toString.call(obj[e]) === '[object Object]'
          ? obj[e]
          : {}),
      prop,
      value,
    );
  } else obj[prop[0]] = value;
}

export const useRole = () => {
  const decode = decodeAccessToken();
  if (decode?.permissions?.role) {
    return decode.permissions.role;
  } else {
    return null;
  }
};

export const usePermissions = () => {
  const decode = decodeAccessToken();
  if (decode?.permissions) {
    return decode.permissions;
  } else {
    return null;
  }
};

export const belongData = () => {
  const decode = decodeAccessToken();

  if (decode?.permissions?.platformId) {
    return {
      platform: {
        connect: {
          id: decode.permissions.platformId,
        },
      },
    };
  } else if (decode?.permissions?.companyId) {
    return {
      company: {
        connect: {
          id: decode.permissions.companyId,
        },
      },
    };
  } else if (decode?.userId) {
    return {
      user: {
        connect: {
          id: decode.userId,
        },
      },
    };
  } else {
    return null;
  }
};

export const belongWhere = () => {
  const decode = decodeAccessToken();

  if (decode?.permissions?.platformId) {
    return {
      platform: {
        id: {
          equals: decode.permissions.platformId,
        },
      },
    };
  } else if (decode?.permissions?.companyId) {
    return {
      company: {
        id: {
          equals: decode.permissions.companyId,
        },
      },
    };
  } else if (decode?.userId) {
    return {
      user: {
        id: {
          equals: decode.userId,
        },
      },
    };
  } else {
    return null;
  }
};

export const useDecode = () => {
  const decode = decodeAccessToken();
  if (decode) {
    return decode;
  } else {
    return null;
  }
};

export const tabMiddleware = (where, modelObject, tab) => {
  const whereWithDefault = where ? where : {};
  if (tab && tab.title != 'Search' && tab.where && tab.match) {
    assign(whereWithDefault, tab.where, tab.match);
  }
  return whereWithDefault;
};

export const dataMiddleware = (data, modelObject) => {
  const decode = decodeAccessToken();
  const dataWithDefault = data ? data : {};
  if (modelObject?.data?.populate) {
    for (let index = 0; index < modelObject.data.populate.length; index++) {
      const rule = modelObject.data.populate[index];
      if (rule?.type) {
        let populateValue;
        switch (rule.type) {
          case 'token':
            populateValue = Object.byString(decode, rule.value);
            break;

          default:
            break;
        }
        assign(dataWithDefault, rule.variable, populateValue);
      }
    }
  }

  return dataWithDefault;
};

export const whereMiddleware = (where, modelObject) => {
  const decode = decodeAccessToken();
  const whereWithDefault = where ? where : {};
  if (modelObject?.where?.populate) {
    for (let index = 0; index < modelObject.where.populate.length; index++) {
      const rule = modelObject.where.populate[index];
      if (rule?.type) {
        let populateValue;
        switch (rule.type) {
          case 'token':
            populateValue = Object.byString(decode, rule.value);
            break;

          default:
            break;
        }
        assign(whereWithDefault, rule.variable, populateValue);
      }
    }
  }

  return whereWithDefault;
};

export const skipMiddleware = (decode, modelObject) => {
  let shouldSkip = true;
  if (modelObject) {
    for (let index = 0; index < modelObject.fields.length; index++) {
      const field = modelObject.fields[index];
      if (field?.where?.populate) {
        let populateValue;
        switch (field.where.populate.type) {
          case 'token':
            populateValue = Object.byString(decode, field.where.populate.value);
            if (populateValue) {
              shouldSkip = false;
            }
            break;

          default:
            break;
        }
      }
    }
  }

  return shouldSkip;
};
