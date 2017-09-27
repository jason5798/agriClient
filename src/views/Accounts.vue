<template>
  <div class="container max-width mx-auto container-zone">
    <div class="row">
      <div id="page-header">
        <h1 class="page-title">帳號</h1>
        <a href="#/accounts"><img class="btn-add m-l21"  src="static/img/btn_add_n.png"/></a>
      </div>
      <div class="row row-giot submenu m-t33">
        <br>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-block">
            <table class="table table-bordered table-striped table-sm">
              <thead>
              <tr>
                <th>Username</th>
                <th>Date registered</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Vishnu Serghei</td>
                <td>2012/01/01</td>
                <td>Member</td>
                <td>
                  <span class="badge badge-success">Active</span>
                </td>
              </tr>
              <tr>
                <td>Zbyněk Phoibos</td>
                <td>2012/02/01</td>
                <td>Staff</td>
                <td>
                  <span class="badge badge-danger">Banned</span>
                </td>
              </tr>
              <tr>
                <td>Einar Randall</td>
                <td>2012/02/01</td>
                <td>Admin</td>
                <td>
                  <span class="badge badge-default">Inactive</span>
                </td>
              </tr>
              <tr>
                <td>Félix Troels</td>
                <td>2012/03/01</td>
                <td>Member</td>
                <td>
                  <span class="badge badge-warning">Pending</span>
                </td>
              </tr>
              <tr>
                <td>Aulus Agmundr</td>
                <td>2012/01/21</td>
                <td>Staff</td>
                <td>
                  <span class="badge badge-success">Active</span>
                </td>
              </tr>
              </tbody>
            </table>
            <nav>
              <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">Prev</a></li>
                <li class="page-item active">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">4</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div><!--/.col-->
    </div><!--/.row-->
  </div>

</template>

<script>
  export default {
    name: 'accounts'
  }
</script>
