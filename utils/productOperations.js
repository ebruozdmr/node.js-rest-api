class ProductOperations {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }
  search() {
    // example url= http://localhost:5000/products?category=telephone&price[gte]=15&price[lte]=50
    const { search, category } = this.queryParams;
    // console.log(search, category, tag);
    const queryArr = [];

    if (search) {
      queryArr.push({
        name: { $regex: search, $options: "i" },
      });
    }
    if (category) {
      queryArr.push({
        category: { $regex: category, $options: "i" },
      });
    }

    console.log(queryArr);
    if (queryArr.length > 0) {
      this.query = this.query.find({ $or: queryArr });
    }

    //   const exp = new RegExp(search, "i");
    //   console.log(exp);

    // console.log({ name: { $regex: this.queryParams.search, $options: "i" } });

    return this;
  }
  filter() {
    const queryCopy = { ...this.queryParams };
    // console.log(queryCopy);
    const removedParams = ["search", "category", "limit", "page"];
    removedParams.forEach((item) => delete queryCopy[item]);
    if (Object.keys(queryCopy).length == 0) {
      // console.log(queryCopy);
      return this;
    }
    let queryCopyStr = JSON.stringify(queryCopy);
    console.log(queryCopyStr);

    queryCopyStr = queryCopyStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    console.log(queryCopyStr);
    this.query = this.query.find(JSON.parse(queryCopyStr));
    return this;
  }
  pagination() {
    console.log(this.queryParams);
    const itemPerPage = this.queryParams.limit || 10;
    const activePage = this.queryParams.page || 1;
    const skip = itemPerPage * (activePage - 1);
    this.query = this.query.limit(itemPerPage).skip(skip);
    return this;
  }
}

module.exports = ProductOperations;
