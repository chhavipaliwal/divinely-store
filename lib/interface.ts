interface Base {
  _id: string;
  addedBy: string;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends Base {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Link extends Base {
  category: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  image?: string;
  slug: string;
  status: 'open' | 'closed';
}

export interface Category extends Base {
  name: string;
  uid: string;
}
