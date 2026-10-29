// DHA-APPROVED CENTERS. EDIT THIS FILE.
// The two entries below are EXAMPLES ONLY (example:true) so you can see the map working. They are NOT real centers.
// How to fill it with real data:
//  1. Get facility names, addresses and licence details from the official Dubai Health Authority (DHA) sources
//     (DHA website / Sheryan registry) or directly from the DHA.
//  2. For each center copy: name, nameAr, area, areaAr, address, phone, lat, lng (from Google/OpenStreetMap), services, languages.
//  3. Put the date you checked it in verifiedOn (YYYY-MM-DD) and the page you used in source.
//  4. Delete the example entries and set placeholder to false.
// services: "slp" speech-language therapy, "learning" learning assessment, "dev" developmental pediatrics / psychology, "aud" hearing & vision
window.TIFLAN_CENTERS = {
  placeholder: true,
  items: [
    { id: "ex1", example: true, name: "EXAMPLE CENTER 1 (delete me)", nameAr: "مركز تجريبي 1 (احذفه)", area: "Oud Metha", areaAr: "عود ميثاء", address: "", phone: "",
      lat: 25.2354, lng: 55.3117, services: ["slp", "learning"], languages: ["ar", "en"], verifiedOn: "", source: "" },
    { id: "ex2", example: true, name: "EXAMPLE CENTER 2 (delete me)", nameAr: "مركز تجريبي 2 (احذفه)", area: "Jumeirah", areaAr: "جميرا", address: "", phone: "",
      lat: 25.2048, lng: 55.2468, services: ["dev", "aud"], languages: ["ar"], verifiedOn: "", source: "" }
  ]
};
