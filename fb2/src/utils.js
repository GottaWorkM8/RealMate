import Compressor from "compressorjs";

// USER SEARCH KEYWORDS
export const generateUserKeywords = (firstName, lastName) => {
  const fName = firstName.toLowerCase();
  const lName = lastName.toLowerCase();
  const fullName = fName + " " + lName;
  const fullName2 = lName + " " + fName;

  const keywords = [];
  for (let i = 1; i <= fullName.length; i++)
    keywords.push(fullName.substring(0, i));
  for (let i = 1; i <= fullName2.length; i++)
    keywords.push(fullName2.substring(0, i));

  return keywords;
};

// GROUP/GROUP CHAT SEARCH KEYWORDS
export const generateGroupKeywords = (groupName) => {
  const gName = groupName.toLowerCase();
  const words = gName.split(/\s+/);
  const keyphrases = generateKeyphrases(words);

  const keywords = [];
  for (const keyphrase of keyphrases) {
    for (let i = 1; i <= keyphrase.length; i++)
      keywords.push(keyphrase.substring(0, i));
  }

  return keywords;
};

// SEARCH KEYPHRASES
const generateKeyphrases = (words) => {
  const keyphrases = [];

  for (let i = 0; i < words.length; i++) {
    const remainingWords = words.slice(i);
    const phrase = remainingWords.join(" ");
    keyphrases.push(phrase);
  }

  return keyphrases;
};

// IMAGE COMPRESSION
const compressImage = (file, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result.toString();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;
        const ratio = width / height;
        const targetRatio = maxWidth / maxHeight;
        let newWidth = width;
        let newHeight = height;
        if (ratio > targetRatio) newWidth = height * targetRatio;
        else newHeight = width / targetRatio;
        const xOffset = (width - newWidth) / 2;
        const yOffset = (height - newHeight) / 2;

        canvas.width = maxWidth;
        canvas.height = maxHeight;
        ctx.drawImage(
          img,
          xOffset,
          yOffset,
          newWidth,
          newHeight,
          0,
          0,
          maxWidth,
          maxHeight
        );

        canvas.toBlob((blob) => {
          new Compressor(blob, {
            quality: 1, // Set to 1 for maximum quality
            success(result) {
              resolve(result);
            },
            error(err) {
              reject(err);
            },
          });
        }, "image/*");
      };
    };

    reader.readAsDataURL(file);
  });
};

export const compressProfileImage = (file) => {
  return compressImage(file, 256, 256);
};

export const compressBackgroundImage = (file) => {
  return compressImage(file, 1280, 512);
};

// MESSAGE CONTENT PREVIEW
export const createMsgPreview = (message) => {
  if (message.length > 18) return message.slice(0, 18) + " ...";
  return message;
};

// DATE FORMATTING
export const formatDate = (date) => {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  const padZero = (num) => (num < 10 ? `0${num}` : num);

  const formatTime = () => {
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
  };

  const formatWeekdayTime = () => {
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getDay()
    ];
    return `${dayOfWeek}, ${formatTime()}`;
  };

  const formatMonthTime = () => {
    const dayOfMonth = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    return `${dayOfMonth} ${month}, ${formatTime()}`;
  };

  const formatYearTime = () => {
    const dayOfMonth = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${dayOfMonth} ${month} ${year}, ${formatTime()}`;
  };

  if (timeDifference < oneDay) {
    return formatTime();
  } else if (timeDifference < 7 * oneDay) {
    return formatWeekdayTime();
  } else if (date.getFullYear() === currentDate.getFullYear()) {
    return formatMonthTime();
  } else {
    return formatYearTime();
  }
};
