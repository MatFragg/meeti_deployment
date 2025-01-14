const groups = [
    // Programming Category Groups (Category ID: 1)
    /*{
        id: '8c6d6c60-4edc-4e65-8b7f-649945712ce9',
        name: 'Tech Innovators',
        description: 'A group for technology enthusiasts and innovators.',
        url: 'https://tech-innovators.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
    },*/
    {
        id: '2a7e6c60-4edc-4e65-8b7f-649945712ce9',
        name: 'AI Pioneers',
        description: 'Exploring the frontiers of Artificial Intelligence.',
        url: 'https://ai-pioneers.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    },
    {
        id: '3b8f7c60-4edc-4e65-8b7f-649945712ce9',
        name: 'Code Masters',
        description: 'Dedicated to mastering programming skills.',
        url: 'https://code-masters.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
    },

    // Design Category Groups (Category ID: 2)
    {
        id: '4d9a8c60-4edc-4e65-8b7f-649945712ce9',
        name: 'Graphic Wizards',
        description: 'A community for graphic design enthusiasts.',
        url: 'https://graphic-wizards.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    },
    {
        id: '5eab9c60-4edc-4e65-8b7f-649945712ce9',
        name: 'Creative Minds',
        description: 'Inspiring creativity in design and art.',
        url: 'https://creative-minds.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
    },
    {
        id: '6fbc0c60-4edc-4e65-8b7f-649945712ce9',
        name: 'UI/UX Heroes',
        description: 'Mastering the art of user interface and experience.',
        url: 'https://ui-ux-heroes.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    },
    // Categoría 4: Fashion & Style
    {
        id: 'e5c8e6ff-6dfb-432d-bb6c-b6f86e6794af',
        name: 'Modern Trends',
        description: 'Exploring the latest in fashion and style.',
        url: 'https://modern-trends.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    },
    {
        id: 'c7a1e9ff-3c49-4ea5-bbd8-8b6d37474867',
        name: 'Vintage Lovers',
        description: 'A group for fans of vintage and retro fashion.',
        url: 'https://vintage-lovers.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
    },
    {
        id: 'f82d3e9a-12ab-40c6-9126-57f1e769302f',
        name: 'Sustainable Fashion',
        description: 'Promoting eco-friendly and sustainable fashion practices.',
        url: 'https://sustainable-fashion.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    },
    // Categoría 5: Health & Sports
    {
        id: 'd3b3f8e2-7a21-4a4b-bff2-8e1938a0d4bf',
        name: 'Healthy Living',
        description: 'A group focused on nutrition and fitness.',
        url: 'https://healthy-living.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
    },
    {
        id: '1a2d4c7f-4826-4c85-9239-5f85b3d87eec',
        name: 'Running Enthusiasts',
        description: 'Meetups for running and marathons.',
        url: 'https://running-enthusiasts.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    },
    {
        id: 'a5e92f1d-7b26-49c6-817f-34d4e25b760a',
        name: 'Yoga Retreats',
        description: 'Connecting yoga lovers for practice and retreats.',
        url: 'https://yoga-retreats.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
    },
    // Categoría 6: Photography & Travelling
    {
        id: 'b1f5aef3-628b-4e4c-9d84-4d64a3f6d8af',
        name: 'Travel Bloggers',
        description: 'Sharing tips and experiences about travel blogging.',
        url: 'https://travel-bloggers.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    },
    {
        id: '7c4b6c3e-fd21-4db9-9324-6a3f84e2c91d',
        name: 'Photography Masters',
        description: 'Advanced photography techniques and networking.',
        url: 'https://photography-masters.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
    },
    {
        id: '85e7a9c6-fb13-4935-87c3-8f91726c64d9',
        name: 'Adventure Seekers',
        description: 'Meetups for adventurous travels and photography.',
        url: 'https://adventure-seekers.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2
    }
]

const categoriesGroup = [
     // Associations for Programming Category
    /*{
        groupId: '8c6d6c60-4edc-4e65-8b7f-649945712ce9', // Tech Innovators
        categoryId: 1, // Programming
        createdAt: new Date(),
        updatedAt: new Date()
    },*/
    {
        groupId: '2a7e6c60-4edc-4e65-8b7f-649945712ce9', // AI Pioneers
        categoryId: 1, // Programming
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        groupId: '3b8f7c60-4edc-4e65-8b7f-649945712ce9', // Code Masters
        categoryId: 1, // Programming
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        groupId: 'e5c8e6ff-6dfb-432d-bb6c-b6f86e6794af',
        categoryId: 4, // Fashion & Style
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        groupId: 'c7a1e9ff-3c49-4ea5-bbd8-8b6d37474867',
        categoryId: 4, // Fashion & Style
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        groupId: 'f82d3e9a-12ab-40c6-9126-57f1e769302f',
        categoryId: 4, // Fashion & Style
        createdAt: new Date(),
        updatedAt: new Date()
    }
]   

export {
    groups,
    categoriesGroup
} 