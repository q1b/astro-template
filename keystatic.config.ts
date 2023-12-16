import { config, collection, singleton, fields } from "@keystatic/core";
import type { LocalConfig, GitHubConfig } from "@keystatic/core";

export const storage: LocalConfig["storage"] | GitHubConfig["storage"] =
	process.env.NODE_ENV === "development"
		? { kind: "local" }
		: {
				kind: "github",
				repo: {
					owner: "q1b",
					name: "q1b",
				},
		  };

export default config({
	storage,
	singletons: {
		site: singleton({
			label: "Site",
			path: "src/content/site/data",
			schema: {
				name: fields.slug({ name: { label: "Name" } }),
				title: fields.text({ label: "Title" }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				image: fields.object({
					src: fields.image({
						label: "Open Graph Image",
						directory: "public/og",
						description: "Open Graph Images are used for SEO",
						publicPath: "/og/",
						validation: { isRequired: true },
					}),
					alt: fields.text({ label: "Alt Text" }),
				}),
			},
		}),
		profile: singleton({
			label: "Profile",
			path: "src/content/profile/data",
			schema: {
				name: fields.text({ label: "Full Name" }),
				about: fields.text({
					label: "About",
					multiline: true,
				}),
				image: fields.object({
					src: fields.image({
						label: "Profile Image",
						directory: "public/profile-image",
						description: "Open Graph Images are used for SEO",
						publicPath: "/profile-image/",
						validation: { isRequired: true },
					}),
					alt: fields.text({ label: "Alt Text" }),
				}),
				links: fields.array(
					fields.object({
						platform: fields.text({
							label: "Platform",
						}),
						label: fields.text({ label: "Label" }),
						link: fields.url({ label: "Link" }),
						me: fields.url({ label: "Me" }),
					}),
					{
						label: "Social Platform",
						itemLabel: (props) =>
							`${props.fields.platform.value} | ${props.fields.label.value}`,
					},
				),
			},
		}),
	},
	collections: {
		posts: collection({
			label: "Posts",
			slugField: "title",
			path: "src/content/posts/*",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				description: fields.text({ label: "Summary", multiline: true }),
				pubDate: fields.date({
					label: "Published date",
					defaultValue: {
						kind: "today",
					},
				}),
				image: fields.image({
					label: "Image",
					directory: "public/images/posts",
					publicPath: "/images/posts/",
				}),
				tags: fields.array(
					fields.relationship({
						label: "Tag",
						collection: "tags",
						validation: {
							isRequired: true,
						},
					}),
					{
						label: "Tags",
						itemLabel: (props) => props.value ?? "Please select",
					},
				),
				content: fields.document({
					label: "Content",
					formatting: true,
					dividers: true,
					links: true,
					images: true,
					tables: true,
				}),
			},
		}),
		tags: collection({
			label: "Tags",
			path: "src/content/tags/*",
			slugField: "name",
			schema: {
				name: fields.slug({
					name: {
						label: "Name",
					},
				}),
			},
		}),
		work: collection({
			label: "Experience",
			path: "src/content/work/*",
			slugField: "role",
			format: { contentField: "summary" },
			schema: {
				role: fields.slug({ name: { label: "Role" } }),
				employment_type: fields.select({
					label: "Employment Type",
					options: [
						{ label: "Full time", value: "full-time" },
						{ label: "Part time", value: "part-time" },
						{ label: "Self-employed", value: "self-employed" },
						{ label: "Freelance", value: "freelance" },
						{ label: "Internship", value: "internship" },
						{ label: "Trainee", value: "trainee" },
					],
					defaultValue: "self-employed",
				}),
				company: fields.object({
					name: fields.text({ label: "Company Name" }),
					site: fields.url({ label: "Company Website" }),
					location: fields.text({ label: "Company Location" }),
				}),
				startDate: fields.date({
					label: "Start Date",
					description: "Your Date of joining the Company",
				}),
				endDate: fields.conditional(
					fields.checkbox({
						label: "currently working in this company",
						defaultValue: false,
					}),
					{
						true: fields.empty(),
						false: fields.date({
							label: "End Date",
							description: "Your Date of leaving the Company",
						}),
					},
				),
				documents: fields.array(
					fields.object({
						document: fields.file({
							label: "Documents",
							description:
								"Any Documents as Letter of Recommandation or Certificates",
							directory: "public/documents/",
							publicPath: "/documents/",
							validation: { isRequired: true },
						}),
						label: fields.text({ label: "Label" }),
					}),
					{
						label: "Documents",
						itemLabel: (props) => `${props.fields.label.value}`,
					},
				),
				summary: fields.document({
					label: "Your Summary of the Work",
					formatting: true,
					dividers: true,
					links: true,
					images: true,
				}),
			},
		}),
		projects: collection({
			label: "Projects",
			path: "src/content/projects/*",
			slugField: "title",
			format: { contentField: "content" },
			schema: {
				title: fields.slug({ name: { label: "Title" } }),
				description: fields.text({
					label: "Description",
					multiline: true,
				}),
				draft: fields.checkbox({ label: "Draft" }),
				type: fields.select({
					label: "Type",
					options: [
						{ label: "Command-Line App", value: "command-line" },
						{ label: "Desktop App", value: "desktop-app" },
						{ label: "Mobile App", value: "mobile-app" },
						{ label: "Library", value: "library" },
						{ label: "Web App", value: "web-app" },
						{ label: "Design", value: "design" },
						{ label: "Software", value: "software" },
					],
					defaultValue: "web-app",
				}),
				tags: fields.array(
					fields.relationship({
						label: "Tag",
						collection: "tags",
						validation: {
							isRequired: true,
						},
					}),
					{
						label: "Tags",
						itemLabel: (props) => props.value ?? "Please select",
					},
				),
				link: fields.url({ label: "URL Link" }),
				content: fields.document({
					label: "Content",
					formatting: true,
					dividers: true,
					links: true,
					images: true,
					tables: true,
				}),
			},
		}),
	},
});