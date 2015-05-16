module.exports = function(grunt) {
 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        uglify: {
            options: {
                banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */ '
            },
            min: {
                files: {
                    'public/js/chat.min.js': ['public/js/chat.js']
                }
            }
        },
        cssmin: {
            min: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['style.css'],
                    dest: 'public/css',
                    ext: '.min.css'
                }]
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify', 'cssmin']); 
 
};