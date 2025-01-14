import { v4 as uuidv4 } from 'uuid';
import Meeti from '../models/Meeti.js';
import db from '../config/db.js';

const meeti = [
    // Meetis for Tech Innovators (Programming Category)
    /*{
        id: '1b5d9c3c-4d76-4e35-b7f3-60a6122b6b01',
        title: 'Introduction to Artificial Intelligence',
        slug: 'introduction-to-artificial-intelligence-xk82d',
        guest: 'Dr. Sarah Johnson',
        slot: 50,
        description: 'Learn the basics of Artificial Intelligence, its applications, and how it is transforming industries.',
        date: '2025-01-10',
        hour: '18:00:00',
        address: '123 Tech Avenue',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        location: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749] // San Francisco
        },
        interestedPpl: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        groupId: '8c6d6c60-4edc-4e65-8b7f-649945712ce9'
    },*/
    {
        id:  uuidv4(),
        title: 'Advanced JavaScript Workshop',
        slug: 'advanced-javascript-workshop-xk83e',
        guest: 'John Doe',
        slot: 40,
        description: 'Deep dive into JavaScript ES6+ concepts.',
        date: '2025-01-12',
        hour: '14:00:00',
        address: '456 Code Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        location: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749] // San Francisco
        },
        interestedPpl: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        groupId: '8c6d6c60-4edc-4e65-8b7f-649945712ce9'
    },
    {
        id:  uuidv4(),
        title: 'Python for Data Science',
        slug: 'python-for-data-science-xk84f',
        guest: 'Dr. Emily Carter',
        slot: 60,
        description: 'Learn how Python is used in the field of Data Science.',
        date: '2025-01-15',
        hour: '16:00:00',
        address: '789 Data Drive',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        location: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749] // San Francisco
        },
        interestedPpl: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        groupId: '8c6d6c60-4edc-4e65-8b7f-649945712ce9'
    },
    // Ejemplo de meetis para los grupos creados anteriormente.
    {
        id:  uuidv4(),
        title: 'Fashion Through the Ages',
        slug: 'fashion-through-the-ages-xk82d',
        guest: 'Emily Clarkson',
        slot: 30,
        description: 'Explore the evolution of fashion trends.',
        date: '2025-01-15',
        hour: '14:00:00',
        address: '10 Fashion Ave',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        location: {
            type: 'Point',
            coordinates: [-74.006, 40.7128] // NYC
        },
        interestedPpl: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        groupId: 'e5c8e6ff-6dfb-432d-bb6c-b6f86e6794af',
    },
    {
        id: uuidv4(),
        title: 'Fitness Trends 2025',
        slug: 'fitness-trends-2025-xk82d',
        guest: 'Mark Johnson',
        slot: 40,
        description: 'Discover the latest fitness trends.',
        date: '2025-02-20',
        hour: '10:00:00',
        address: '5th Ave Gym',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA',
        location: {
            type: 'Point',
            coordinates: [-118.2437, 34.0522] // LA
        },
        interestedPpl: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
        groupId: 'd3b3f8e2-7a21-4a4b-bff2-8e1938a0d4bf',
    },
]   

export default meeti;