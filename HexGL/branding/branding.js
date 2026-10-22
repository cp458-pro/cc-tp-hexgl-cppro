/*
 * Branding de l'écran d'accueil (personnalisation événementielle).
 *
 * Point de configuration unique : seul l'objet bkcore.Branding.config se modifie.
 * Une valeur à null conserve l'apparence d'origine ; enabled à false n'applique rien.
 */

var bkcore = bkcore || {};

bkcore.Branding = {};

bkcore.Branding.config = {
	enabled: true,
	name: "ACME",
	welcome: null,
	logo: {
		src: "branding/logo.png",
		alt: "ACME"
	},
	colors: {
		menu: null,
		accent: null,
		accentHover: null
	}
};

bkcore.Branding.cssVariables = {
	menu: "--brand-menu",
	accent: "--brand-accent",
	accentHover: "--brand-accent-hover"
};

bkcore.Branding.isSet = function(value)
{
	return value != null && value !== "";
};

/*
 * Applique la configuration au document et renvoie true si elle est active.
 * Un élément absent du document est ignoré.
 */
bkcore.Branding.apply = function(config, doc)
{
	if(!config || !config.enabled)
		return false;

	var B = bkcore.Branding;
	var logo = config.logo || {};
	var colors = config.colors || {};
	var title = doc.getElementById("title");
	var block = doc.getElementById("brand-block");
	var name = doc.getElementById("brand-name");
	var welcome = doc.getElementById("brand-welcome");

	if(title && B.isSet(logo.src))
	{
		title.style.backgroundImage = 'url("' + logo.src + '")';
		if(B.isSet(logo.alt))
		{
			title.setAttribute("role", "img");
			title.setAttribute("aria-label", logo.alt);
		}
	}

	if(name && B.isSet(config.name))
		name.textContent = config.name;
	if(welcome && B.isSet(config.welcome))
		welcome.textContent = config.welcome;
	if(block && (B.isSet(config.name) || B.isSet(config.welcome)))
		block.style.display = "block";

	for(var key in B.cssVariables)
	{
		if(B.isSet(colors[key]))
			doc.documentElement.style.setProperty(B.cssVariables[key], colors[key]);
	}

	return true;
};

bkcore.Branding.apply(bkcore.Branding.config, document);
