const {
  getWave,
  getWaves,
  createWave,
  deleteWave,
  updateWave,
  getCurrentUserWavesWithFollowing,
} = require("../queries/waves.queries");
const sanitizeHTML = require("sanitize-html");

exports.waveList = async (req, res, next) => {
  try {
    const waves = await getCurrentUserWavesWithFollowing(req.user);
    res.render("waves/wave", {
      waves, // Waves de l'utilisateur et de ceux qu'il suit
      isAuthenticated: req.isAuthenticated(), // Statut d'authentification de l'utilisateur
      currentUser: req.user, // Utilisateur actuellement connecté
      user: req.user, // Utilisateur actuellement connecté (redondant avec currentUser)
      editable: true, // Indicateur que les waves peuvent être éditées
    });
  } catch (e) {
    next(e);
  }
};

exports.allWaves = async (req, res, next) => {
  try {
    const waves = await getWaves();
    res.render("waves/wave", {
      waves,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
      editable: false,
      editable: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.waveNew = (req, res, next) => {
  res.render("waves/wave-form", {
    wave: {},
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

const sanitizeHtml = require("sanitize-html");

exports.waveCreate = async (req, res, next) => {
  try {
    const body = req.body;
    console.log("Request body:", body);

    // Configuration pour désinfecter le contenu HTML
    const sanitizedContent = sanitizeHtml(body.content, {
      allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "ul",
        "ol",
        "li",
        "p",
        "textarea",
      ],
      allowedAttributes: {
        a: ["href", "target"],
      },
      allowedIframeHostnames: [], // Aucun iframe autorisé
      allowedSchemes: ["http", "https", "ftp", "mailto"], // Seuls ces schémas sont autorisés pour les liens
      selfClosing: [
        "br",
        "img",
        "hr",
        "area",
        "base",
        "basefont",
        "input",
        "link",
        "meta",
      ], // Balises auto-fermantes autorisées
      nonTextTags: ["style", "script", "textarea", "noscript"], // Balises non-textuelles autorisées
      exclusiveFilter: frame => {
        // Filtrer les éléments non autorisés
        if (frame.tag === "a") {
          // Vérifier que le lien est externe pour éviter les attaques de phishing
          const href = frame.attribs.href;
          if (
            href &&
            !href.startsWith("/") &&
            !href.startsWith("#") &&
            !href.startsWith("http://") &&
            !href.startsWith("https://")
          ) {
            return {
              tagName: "a",
              attribs: {
                href: "#", // Remplacer le lien externe par un lien interne
                target: "_blank", // Ouvrir le lien dans une nouvelle fenêtre
                rel: "noopener noreferrer", // Ajouter des attributs de sécurité pour les liens externes
              },
            };
          }
        }
      },
    });
    console.log("Sanitized content:", sanitizedContent);

    const waveData = {
      ...body,
      content: sanitizedContent,
      author: req.user._id,
    };
    console.log("Wave data to be saved:", waveData);

    await createWave(waveData);
    res.redirect("/waves");
  } catch (e) {
    console.error("Error creating wave:", e);
    res.status(400).render("waves/wave-form", {
      errors: [e.message],
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.waveDelete = async (req, res, next) => {
  try {
    const waveId = req.params.waveId;
    await deleteWave(waveId);
    const waves = await getCurrentUserWavesWithFollowing(req.user);
    res.render("waves/wave-list", {
      waves,
      currentUser: req.user,
      editable: true,
    });
  } catch (e) {
    next(e);
  }
};

exports.waveEdit = async (req, res, next) => {
  try {
    const waveId = req.params.waveId;
    const wave = await getWave(waveId);
    res.render("waves/wave-form", {
      wave,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.waveUpdate = async (req, res, next) => {
  const waveId = req.params.waveId;

  try {
    const body = req.body;
    await updateWave(waveId, body);
    res.redirect("/waves");
  } catch (e) {
    const errors = Object.keys(e.errors).map(key => e.errors[key].message);
    const wave = await getWave(waveId);
    res.status(400);
    res.status(400).render("waves/wave-form", {
      errors,
      wave,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};
