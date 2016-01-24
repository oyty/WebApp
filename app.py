# coding=utf-8
from flask import Flask, render_template, url_for, redirect, abort, request, session
from flask_sqlalchemy import SQLAlchemy

from flask_admin.contrib import sqla
from flask_admin import Admin, form
from flask_admin import helpers as admin_helpers

from flask_security import UserMixin, RoleMixin, SQLAlchemyUserDatastore, Security, \
    current_user
from flask_security.utils import encrypt_password
from jinja2 import Markup
from sqlalchemy.event import listens_for
from flask_babelex import Babel
import sys
import os

reload(sys)
sys.setdefaultencoding('utf-8')


# Create application
app = Flask(__name__, static_folder='static')
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)

babel = Babel(app)


@babel.localeselector
def get_locale():
    override = request.args.get('lang')

    if override:
        session['lang'] = override

    return session.get('lang', 'zh_CN')


# Create directory for file fields to use
file_path = os.path.join(os.path.dirname(__file__), 'files')
try:
    os.mkdir(file_path)
except OSError:
    pass

roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)


class BaseModelView(sqla.ModelView):
    def is_accessible(self):
        if not current_user.is_active or not current_user.is_authenticated:
            return False

        if current_user.has_role('superuser'):
            return True

        return False

    def _handle_view(self, name, **kwargs):
        '''
        Override buildin _handle_view in order to redirect users when a view is not accessible
        '''
        if not self.is_accessible():
            if current_user.is_authenticated:
                abort(403)
            else:
                return redirect(url_for('security.login', next=request.url))


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(225))

    def __unicode__(self):
        return self.name


class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))

    def __unicode__(self):
        return self.name


# Setup Flask-Security
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)


class People(db.Model):
    __tablename__ = 'peoples'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.Unicode(64), nullable=False)
    photo = db.Column(db.Unicode(128), nullable=False)

    def __unicode__(self):
        return self.name


@listens_for(People, 'after_delete')
def del_image(mapper, connection, target):
    if target.path:
        # Delete image
        try:
            os.remove(os.path.join(file_path, target.path))
        except OSError:
            pass

        # Delete thumbnail
        try:
            os.remove(os.path.join(file_path,
                                   form.thumbgen_filename(target.path)))
        except OSError:
            pass


class Description(db.Model):
    __tablename__ = 'descriptions'
    description_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    people_id = db.Column(db.Integer, db.ForeignKey('peoples.id'))
    people = db.relationship('People', backref='descriptions')
    desc = db.Column(db.Unicode(), nullable=False)

    def __unicode__(self):
        return self.desc


class PeopleAdmin(BaseModelView):
    column_display_pk = True
    form_columns = ['name', 'descriptions', 'photo']
    column_list = ['id', 'name', 'photo']

    def _list_thumbnail(view, context, model, name):
        if not model.photo:
            return ''
        return Markup('<img src="%s">' % url_for('static',
                                                 filename=form.thumbgen_filename(model.photo)))

    column_formatters = {
        'photo': _list_thumbnail
    }

    # Alternative way to contribute field is to override it completely.
    # In this case, Flask-Admin won't attempt to merge various parameters for the field.
    form_extra_fields = {
        'photo': form.ImageUploadField('Image',
                                       base_path=file_path,
                                       thumbnail_size=(100, 100, True))
    }


class DescriptionAdmin(BaseModelView):
    column_display_pk = True
    form_columns = ['people', 'desc']
    column_sortable_list = ['people', 'desc']
    column_list = ['people', 'desc']


# Create model
class Contact(db.Model):
    # def __init__(self, mobile, qq, email, address):
    #     self.mobile = mobile
    #     self.qq = qq
    #     self.email = email
    #     self.address = address

    id = db.Column(db.Integer, primary_key=True)
    mobile = db.Column(db.String(20), nullable=False)
    qq = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    qrcode = db.Column(db.Unicode(128), nullable=False)

    # Required for admin interface. For python 3 please use __str__ instead.
    def __unicode__(self):
        return self.name


# Add custom filter and standard FilterEqual to ModelView
class ContactAdmin(BaseModelView):
    # column_list = ['id', 'mobile', 'qq', 'email', 'address', 'path']
    column_sortable_list = ['mobile', 'qq', 'email', 'address', 'qrcode']
    column_list = ['mobile', 'QQ', 'email', 'address', 'qrcode']

    def _list_thumbnail(view, context, model, name):
        if not model.qrcode:
            return ''
        return Markup('<img src="%s">' % url_for('static',
                                                 filename=form.thumbgen_filename(model.qrcode)))

    column_formatters = {
        'qrcode': _list_thumbnail
    }

    # Alternative way to contribute field is to override it completely.
    # In this case, Flask-Admin won't attempt to merge various parameters for the field.
    form_extra_fields = {
        'qrcode': form.ImageUploadField('Image',
                                        base_path=file_path,
                                        thumbnail_size=(100, 100, True))
    }


class Company(db.Model):
    __tablename__ = 'company'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    name_english = db.Column(db.String(100), nullable=False)
    logo = db.Column(db.Unicode(128), nullable=False)

    def __unicode__(self):
        return self.name


class CompanyAdmin(BaseModelView):
    column_sortable_list = ['name', 'name_english', 'logo']
    column_list = ['name', 'name_english', 'logo']

    def _list_thumbnail(view, context, model, name):
        if not model.logo:
            return ''
        return Markup('<img src="%s">' % url_for('static',
                                                 filename=form.thumbgen_filename(model.logo)))

    column_formatters = {
        'logo': _list_thumbnail
    }

    # Alternative way to contribute field is to override it completely.
    # In this case, Flask-Admin won't attempt to merge various parameters for the field.
    form_extra_fields = {
        'logo': form.ImageUploadField('Image',
                                      base_path=file_path,
                                      thumbnail_size=(100, 100, True))
    }


class Slogan(db.Model):
    __tablename__ = 'slogan'
    id = db.Column(db.Integer(), primary_key=True)
    desc1 = db.Column(db.String(200), nullable=False)
    desc2 = db.Column(db.String(200), nullable=False)
    desc3 = db.Column(db.String(200), nullable=False)
    desc4 = db.Column(db.String(200), nullable=False)
    desc5 = db.Column(db.String(200), nullable=False)

    def __unicode__(self):
        return self.desc1


class Profile(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    brief1 = db.Column(db.String(100), nullable=False)
    brief2 = db.Column(db.String(100), nullable=False)
    brief3 = db.Column(db.String(100), nullable=False)
    brief4 = db.Column(db.String(100), nullable=False)
    brief5 = db.Column(db.String(100), nullable=False)
    brief6 = db.Column(db.String(100), nullable=False)
    brief = db.Column(db.UnicodeText, nullable=False)

    def __unicode__(self):
        return self.name


class Service(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    sort_num = db.Column(db.Integer(), nullable=False)
    title = db.Column(db.String(), nullable=False)
    link = db.Column(db.String(), nullable=False)

    def __unicode__(self):
        return self.name


# Flask views
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/product')
def product():
    return render_template('product.html')

@app.route('/talent')
def talent():
    return render_template('talent.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/agency')
def agency():
    return render_template('agency.html')

@app.route('/contact')
def contact():
    c = Contact.query.filter_by(id='1').first()
    return render_template('contact.html', contact=c)


admin = Admin(app,
              name=unicode('后台管理'),
              base_template='my_master.html',
              template_mode="bootstrap3")

admin.add_view(BaseModelView(Role, db.session, name='角色', category='用户'))
admin.add_view(BaseModelView(User, db.session, name='用户', category='用户'))
# admin.add_view(PeopleAdmin(People, db.session, name='People', category='TalentTeam'))
# admin.add_view(DescriptionAdmin(Description, db.session, name='Description', category='TalentTeam'))
admin.add_view(CompanyAdmin(Company, db.session, name='名称&商标'))
admin.add_view(BaseModelView(Slogan, db.session, name='口号'))
admin.add_view(BaseModelView(Profile, db.session, name='简介'))
admin.add_view(BaseModelView(Service, db.session, name='产品服务'))
admin.add_view(PeopleAdmin(People, db.session, name='人才', category='人才团队'))
admin.add_view(DescriptionAdmin(Description, db.session, name='描述', category='人才团队'))
admin.add_view(ContactAdmin(Contact, db.session, name='联系方式', menu_class_name='爱的'))


@security.context_processor
def security_context_processor():
    return dict(
        admin_base_template=admin.base_template,
        admin_view=admin.index_view,
        h=admin_helpers,
    )


def build_sample_db():
    db.drop_all()
    db.create_all()

    with app.app_context():
        user_role = Role(name='user', description=unicode('普通用户'))
        super_user_role = Role(name='superuser', description=unicode('管理员'))
        # people = People(name='people1')
        # contact = Contact("13631527007", "309088728", "cooloyty@gmail.com", unicode("深圳市南山区海月花园26栋702"))
        db.session.add(user_role)
        db.session.add(super_user_role)
        # db.session.add(people)
        # db.session.add(contact)
        db.session.commit()

        user_datastore.create_user(
            name='admin',
            password=encrypt_password('admin'),
            email='cooloyty@gmail.com',
            roles=[user_role, super_user_role]
        )
        db.session.commit()


if __name__ == '__main__':
    app_dir = os.path.realpath(os.path.dirname(__file__))
    database_path = os.path.join(app_dir, app.config['DATABASE_FILE'])
    if not os.path.exists(database_path):
        build_sample_db()
    app.run(port=5555, debug=True)
