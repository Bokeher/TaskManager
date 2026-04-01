# Project Setup

## 1. Environment variables

1. Create a `.env` file by copying `.env.example`
2. Replace `<your-mongodb-connection-string>` in `.env`
with your [MongoDB URI](#how-to-get-mongodb-uri)

#### Example MongoDB URI
```
mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
```
---

## 2. Install dependencies

```
npm run install-all
```

---

## 3. Run the project

```
npm start
```

---

## How to get MongoDB URI

You need to provide your own MongoDB connection string in `.env`.

If you don't have one:

- create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- go to **Connect → Drivers**
- copy the connection string
- paste it into `.env`
- replace `<db_password>` with your password