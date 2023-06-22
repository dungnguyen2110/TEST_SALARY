import React, { useState, useEffect } from "react";
import axios from "axios";
import allTransactions from "./data.json";
function App() {
  // const [users, setUsers] = useState([]);
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // function getUsers() {
  //   axios
  //     .get("http://localhost:3001/users")
  //     .then((res) => {
  //       setUsers(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // function createUser(e) {
  //   // console.log(e);
  //   e.preventDefault();

  //   const user = {
  //     name: name,
  //     email: email,
  //     phone: phone,
  //   };

  //   axios
  //     .post("http://localhost:3001/create", user)
  //     .then((res) => {
  //       console.log(res);
  //       setName("");
  //       setEmail("");
  //       setPhone("");
  //       getUsers();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // function updateUser(id) {
  //   console.log(id);
  //   // console.log(e);
  //   // e.preventDefault();

  //   const user = {
  //     name: name,
  //     email: email,
  //     phone: phone,
  //   };

  //   axios
  //     .put(`http://localhost:3001/update/${id}`, user)
  //     .then((res) => {
  //       console.log(res);
  //       setName("");
  //       setEmail("");
  //       setPhone("");
  //       getUsers();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // function deleteUser(id) {
  //   axios
  //     .delete(`http://localhost:3001/delete/${id}`)
  //     .then((res) => {
  //       console.log(res);
  //       getUsers();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  // return (
  //   <div className="App">
  //     <h1>CRUD with REACT, MYSQL, NODEJS</h1>

  //     <form onSubmit={createUser}>
  //       <h2>Create User</h2>

  //       <label>Name:</label>
  //       <input
  //         type="text"
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //       />
  //       <br />

  //       <label>Email:</label>
  //       <input
  //         type="email"
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //       />
  //       <br />

  //       <label>Phone:</label>
  //       <input
  //         type="text"
  //         value={phone}
  //         onChange={(e) => setPhone(e.target.value)}
  //       />
  //       <br />

  //       <button type="submit">Create</button>
  //     </form>

  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Name</th>
  //           <th>Email</th>
  //           <th>Phone</th>
  //           <th>Action</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {users.map((user) => (
  //           <tr key={user.id}>
  //             <td>{user.name}</td>
  //             <td>{user.email}</td>
  //             <td>{user.phone}</td>
  //             <td>
  //               <button onClick={() => deleteUser(user.id)}>Delete</button>
  //               <button onClick={() => updateUser(user.id)}>Update</button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );

  // console.log(fft);
  // Dữ liệu giao dịch

  // Bước 1: Lọc các giao dịch chỉ thêm tiền vào tài khoản, thêm điều kiện
  const KEYWORDS = [
    "salary",
    "lương",
    "payroll",
    "wage",
    "compensation",
    "bonus",
    "thưởng",
    "hoa hồng",
  ];

  const filteredTransactions = allTransactions.filter((t) => {
    const upperCaseDesc = t.description.toUpperCase();
    return (
      t.amount > 0 &&
      KEYWORDS.some((keyword) => upperCaseDesc.includes(keyword.toUpperCase()))
    );
  });
  console.log("Lọc giao dịch: ", filteredTransactions);

  // Bước 2: Làm tròn số
  const roundedTransactions = filteredTransactions.map((t) => ({
    date: t.when,
    amount: Math.round(t.amount / 100000) * 100000,
    description: t.description,
  }));
  console.log("Làm tròn", roundedTransactions);

  // Tìm ngày đầu tiên và ngày cuối cùng trong dữ liệu giao dịch
  const firstDate = new Date(roundedTransactions[0].date);
  const lastDate = new Date(
    roundedTransactions[roundedTransactions.length - 1].date
  );

  // Tính số tháng nhận lương
  const monthsSalary =
    (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
    lastDate.getMonth() -
    firstDate.getMonth() +
    1;

  const sumSalary = roundedTransactions.reduce(
    (accumulator, currentValue) => accumulator + currentValue.amount,
    0
  );

  const predictSalaryMonth = sumSalary / monthsSalary;

  console.log(
    "Tiền lương trung bình mỗi tháng theo giải pháp lọc từ khóa:",
    predictSalaryMonth
  );

  // Bước 3: Tạo tập dữ liệu tiền thêm vào tài khoản mỗi ngày
  const dailyAmounts = roundedTransactions.reduce((acc, { date, amount }) => {
    const day = date.substr(0, 10);
    const existingDay = acc.find((item) => item.date === day);
    if (existingDay) {
      existingDay.amount += amount;
    } else {
      acc.push({ date: day, amount });
    }
    return acc;
  }, []);

  // console.log("Tiền mỗi ngày:", dailyAmounts);

  // Bước 4: Áp dụng biến đổi Fourier rời rạc để tìm các thành phần tuần hoàn trong chuỗi thời gian này\
  // Chuỗi thời gian
  // const a = dailyAmounts;

  // const n = a.length;
  // const x = a.map((item) => parseFloat(item.amount));
  // const X = new Array(n);

  // // Perform discrete Fourier transform on x
  // for (let k = 0; k < n; k++) {
  //   let real = 0;
  //   let imag = 0;

  //   for (let t = 0; t < n; t++) {
  //     const angle = (2 * Math.PI * k * t) / n;
  //     real += x[t] * Math.cos(angle);
  //     imag -= x[t] * Math.sin(angle);
  //   }

  //   X[k] = { real, imag };
  // }

  // // Find the index corresponding to the 30-day periodic component
  // // (assuming a 30-day cycle)
  // let periodicityIndex = n > 30 ? Math.round(n / 1) : 1;

  // // Set all other periodic components to 0
  // for (let k = 0; k < n; k++) {
  //   if ((k + 1) % periodicityIndex !== 0) {
  //     X[k].real = 0;
  //     X[k].imag = 0;
  //   }
  // }

  // // Perform inverse discrete Fourier transform on X
  // const y = new Array(n);

  // for (let t = 0; t < n; t++) {
  //   let real = 0;
  //   let imag = 0;

  //   for (let k = 0; k < n; k++) {
  //     const angle = (2 * Math.PI * k * t) / n;
  //     real += X[k].real * Math.cos(angle) - X[k].imag * Math.sin(angle);
  //     imag += X[k].real * Math.sin(angle) + X[k].imag * Math.cos(angle);
  //   }

  //   y[t] = real / n;
  // }

  // // Print the resulting time series
  // for (let i = 0; i < n; i++) {
  //   // console.log(`${a[i].date}: ${y[i]}`);
  // }
}

export default App;
